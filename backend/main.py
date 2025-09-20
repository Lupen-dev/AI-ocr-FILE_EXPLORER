import os
import uuid
import sqlite3
import asyncio
from datetime import datetime
from pathlib import Path
from typing import List, Optional
import aiofiles
try:
    import pytesseract
    from PIL import Image
    TESSERACT_AVAILABLE = True
except ImportError:
    print("Uyarı: Tesseract OCR bulunamadı. OCR özelliği çalışmayacak.")
    TESSERACT_AVAILABLE = False
import PyPDF2
import pandas as pd
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn

# Proje yapılandırması
UPLOAD_DIR = Path("../uploads")
DATABASE_DIR = Path("../database")
UPLOAD_DIR.mkdir(exist_ok=True)
DATABASE_DIR.mkdir(exist_ok=True)

# FastAPI uygulaması
app = FastAPI(title="AI OCR File Explorer", version="1.0.0")

# CORS middleware - LAN erişimi için
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # LAN üzerindeki tüm IP'lere izin ver
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Veri modelleri
class FileInfo(BaseModel):
    id: str
    original_name: str
    file_name: str
    file_size: int
    file_type: str
    upload_date: str
    ocr_content: Optional[str] = None

class SearchResult(BaseModel):
    files: List[FileInfo]
    total: int

# Veritabanı başlatma
def init_database():
    """Veritabanını ve tabloları oluştur"""
    conn = sqlite3.connect(DATABASE_DIR / "files.db")
    cursor = conn.cursor()
    
    # Dosya bilgileri tablosu
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS files (
            id TEXT PRIMARY KEY,
            original_name TEXT NOT NULL,
            file_name TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            file_type TEXT NOT NULL,
            upload_date TEXT NOT NULL,
            file_path TEXT NOT NULL
        )
    """)
    
    # OCR içerik tablosu
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ocr_content (
            id TEXT PRIMARY KEY,
            file_id TEXT NOT NULL,
            content TEXT NOT NULL,
            extraction_date TEXT NOT NULL,
            FOREIGN KEY (file_id) REFERENCES files (id)
        )
    """)
    
    conn.commit()
    conn.close()

def generate_process_id() -> str:
    """İşlem ID'si oluştur"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    return f"{timestamp}_{unique_id}"

def get_file_extension(filename: str) -> str:
    """Dosya uzantısını al"""
    return Path(filename).suffix.lower()

async def extract_text_from_file(file_path: Path, file_type: str) -> str:
    """Dosyadan metin çıkar (OCR)"""
    try:
        if file_type in ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']:
            # Resim dosyaları için OCR
            if not TESSERACT_AVAILABLE:
                return "OCR özelliği mevcut değil - Tesseract kurulmamış"
            
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image, lang='tur+eng')
            return text.strip()
        
        elif file_type == '.pdf':
            # PDF dosyaları için metin çıkarma
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            
            # Eğer PDF'den metin çıkaramazsa OCR dene
            if not text.strip() and TESSERACT_AVAILABLE:
                # PDF'i resme çevir ve OCR uygula (gelişmiş uygulama için)
                pass
            
            return text.strip()
        
        elif file_type in ['.xlsx', '.xls']:
            # Excel dosyaları için
            df = pd.read_excel(file_path)
            text = df.to_string(index=False)
            return text
        
        elif file_type == '.csv':
            # CSV dosyaları için
            df = pd.read_csv(file_path)
            text = df.to_string(index=False)
            return text
        
        else:
            return ""
    
    except Exception as e:
        print(f"Metin çıkarma hatası: {e}")
        return f"Hata: {str(e)}"

def save_file_to_db(file_info: dict, ocr_content: str):
    """Dosya bilgilerini ve OCR içeriğini veritabanına kaydet"""
    conn = sqlite3.connect(DATABASE_DIR / "files.db")
    cursor = conn.cursor()
    
    # Dosya bilgilerini kaydet
    cursor.execute("""
        INSERT INTO files (id, original_name, file_name, file_size, file_type, upload_date, file_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        file_info['id'],
        file_info['original_name'],
        file_info['file_name'],
        file_info['file_size'],
        file_info['file_type'],
        file_info['upload_date'],
        file_info['file_path']
    ))
    
    # OCR içeriğini kaydet
    if ocr_content:
        cursor.execute("""
            INSERT INTO ocr_content (id, file_id, content, extraction_date)
            VALUES (?, ?, ?, ?)
        """, (
            str(uuid.uuid4()),
            file_info['id'],
            ocr_content,
            datetime.now().isoformat()
        ))
    
    conn.commit()
    conn.close()

def search_files_in_db(query: str, limit: int = 50, offset: int = 0) -> SearchResult:
    """Veritabanından dosya ara"""
    conn = sqlite3.connect(DATABASE_DIR / "files.db")
    cursor = conn.cursor()
    
    if query:
        # Dosya adında veya OCR içeriğinde ara
        cursor.execute("""
            SELECT DISTINCT f.id, f.original_name, f.file_name, f.file_size, f.file_type, f.upload_date, o.content
            FROM files f
            LEFT JOIN ocr_content o ON f.id = o.file_id
            WHERE f.original_name LIKE ? OR f.file_name LIKE ? OR o.content LIKE ?
            ORDER BY f.upload_date DESC
            LIMIT ? OFFSET ?
        """, (f"%{query}%", f"%{query}%", f"%{query}%", limit, offset))
        
        # Toplam sonuç sayısı
        cursor.execute("""
            SELECT COUNT(DISTINCT f.id)
            FROM files f
            LEFT JOIN ocr_content o ON f.id = o.file_id
            WHERE f.original_name LIKE ? OR f.file_name LIKE ? OR o.content LIKE ?
        """, (f"%{query}%", f"%{query}%", f"%{query}%"))
        total = cursor.fetchone()[0]
    else:
        # Tüm dosyaları listele
        cursor.execute("""
            SELECT f.id, f.original_name, f.file_name, f.file_size, f.file_type, f.upload_date, o.content
            FROM files f
            LEFT JOIN ocr_content o ON f.id = o.file_id
            ORDER BY f.upload_date DESC
            LIMIT ? OFFSET ?
        """, (limit, offset))
        
        cursor.execute("SELECT COUNT(*) FROM files")
        total = cursor.fetchone()[0]
    
    results = cursor.fetchall()
    
    files = []
    for row in results:
        files.append(FileInfo(
            id=row[0],
            original_name=row[1],
            file_name=row[2],
            file_size=row[3],
            file_type=row[4],
            upload_date=row[5],
            ocr_content=row[6] if row[6] else None
        ))
    
    conn.close()
    return SearchResult(files=files, total=total)

# API Endpoints
@app.on_event("startup")
async def startup_event():
    """Uygulama başlatıldığında veritabanını başlat"""
    init_database()

@app.get("/")
async def root():
    """Ana sayfa"""
    return {"message": "AI OCR File Explorer API", "version": "1.0.0"}

@app.post("/upload", response_model=FileInfo)
async def upload_file(file: UploadFile = File(...)):
    """Dosya yükle ve OCR işle"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="Dosya adı boş olamaz")
    
    # İşlem ID'si oluştur
    process_id = generate_process_id()
    file_extension = get_file_extension(file.filename)
    new_filename = f"{process_id}{file_extension}"
    file_path = UPLOAD_DIR / new_filename
    
    # Dosyayı kaydet
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    # Dosya bilgileri
    file_info = {
        'id': process_id,
        'original_name': file.filename,
        'file_name': new_filename,
        'file_size': len(content),
        'file_type': file_extension,
        'upload_date': datetime.now().isoformat(),
        'file_path': str(file_path)
    }
    
    # OCR işlemi
    ocr_content = await extract_text_from_file(file_path, file_extension)
    
    # Veritabanına kaydet
    save_file_to_db(file_info, ocr_content)
    
    return FileInfo(
        id=file_info['id'],
        original_name=file_info['original_name'],
        file_name=file_info['file_name'],
        file_size=file_info['file_size'],
        file_type=file_info['file_type'],
        upload_date=file_info['upload_date'],
        ocr_content=ocr_content
    )

@app.get("/files", response_model=SearchResult)
async def list_files(
    query: Optional[str] = Query(None, description="Arama sorgusu"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Dosyaları listele ve ara"""
    return search_files_in_db(query or "", limit, offset)

@app.get("/files/{file_id}")
async def get_file_info(file_id: str):
    """Dosya bilgilerini al"""
    conn = sqlite3.connect(DATABASE_DIR / "files.db")
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT f.id, f.original_name, f.file_name, f.file_size, f.file_type, f.upload_date, o.content
        FROM files f
        LEFT JOIN ocr_content o ON f.id = o.file_id
        WHERE f.id = ?
    """, (file_id,))
    
    result = cursor.fetchone()
    conn.close()
    
    if not result:
        raise HTTPException(status_code=404, detail="Dosya bulunamadı")
    
    return FileInfo(
        id=result[0],
        original_name=result[1],
        file_name=result[2],
        file_size=result[3],
        file_type=result[4],
        upload_date=result[5],
        ocr_content=result[6]
    )

@app.get("/download/{file_id}")
async def download_file(file_id: str):
    """Dosya indir"""
    conn = sqlite3.connect(DATABASE_DIR / "files.db")
    cursor = conn.cursor()
    
    cursor.execute("SELECT original_name, file_path FROM files WHERE id = ?", (file_id,))
    result = cursor.fetchone()
    conn.close()
    
    if not result:
        raise HTTPException(status_code=404, detail="Dosya bulunamadı")
    
    original_name, file_path = result
    
    if not Path(file_path).exists():
        raise HTTPException(status_code=404, detail="Dosya sistem üzerinde bulunamadı")
    
    return FileResponse(
        path=file_path,
        filename=original_name,
        media_type='application/octet-stream'
    )

@app.delete("/files/{file_id}")
async def delete_file(file_id: str):
    """Dosya sil"""
    conn = sqlite3.connect(DATABASE_DIR / "files.db")
    cursor = conn.cursor()
    
    # Dosya bilgilerini al
    cursor.execute("SELECT file_path FROM files WHERE id = ?", (file_id,))
    result = cursor.fetchone()
    
    if not result:
        raise HTTPException(status_code=404, detail="Dosya bulunamadı")
    
    file_path = result[0]
    
    # Veritabanından sil
    cursor.execute("DELETE FROM ocr_content WHERE file_id = ?", (file_id,))
    cursor.execute("DELETE FROM files WHERE id = ?", (file_id,))
    conn.commit()
    conn.close()
    
    # Dosyayı diskten sil
    if Path(file_path).exists():
        Path(file_path).unlink()
    
    return {"message": "Dosya başarıyla silindi"}

if __name__ == "__main__":
    # LAN üzerinden erişim için host='0.0.0.0'
    uvicorn.run(app, host="0.0.0.0", port=8000)