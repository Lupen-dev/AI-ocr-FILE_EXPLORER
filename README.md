# AI OCR File Explorer

Tamamen offline çalışan, LAN üzerinden erişilebilen, OCR destekli dosya yönetim sistemi.

## 🚀 Özellikler

- **Offline Çalışma**: İnternet bağlantısı gerektirmez
- **LAN Erişimi**: Aynı ağdaki tüm cihazlardan erişilebilir
- **OCR Desteği**: Resim, PDF ve Excel dosyalarından metin çıkarma
- **Dosya Arama**: Dosya adı ve içeriği üzerinden arama
- **İşlem ID Bazlı İsimlendirme**: Her dosya unique ID ile numaralandırılır
- **Modern UI**: Kullanıcı dostu arayüz
- **Çoklu Dosya Türü**: JPG, PNG, PDF, Excel, CSV desteği

## 📋 Sistem Gereksinimleri

- Python 3.8+
- Node.js 16+
- Tesseract OCR

## 🛠️ Kurulum

### 1. Tesseract OCR Kurulumu

**Windows:**
1. [Tesseract Windows Installer](https://github.com/UB-Mannheim/tesseract/wiki) indirin
2. Kurulum sırasında "Additional language data" seçeneğini işaretleyin
3. Türkçe dil paketini seçin
4. PATH'e eklendiğinden emin olun

**Linux:**
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr tesseract-ocr-tur
```

### 2. Backend Kurulumu

```bash
cd backend
pip install -r requirements.txt
```

### 3. Frontend Kurulumu

```bash
cd frontend
npm install
```

## 🚀 Çalıştırma

### Backend'i Başlatma
```bash
cd backend
python main.py
```
Backend http://0.0.0.0:8000 adresinde çalışacak.

### Frontend'i Başlatma
```bash
cd frontend
npm start
```
Frontend http://localhost:3000 adresinde çalışacak.

## 🌐 LAN Erişimi

### Backend (API)
- Lokal: http://localhost:8000
- LAN: http://[BILGISAYAR_IP]:8000

### Frontend (Web Arayüzü)
- Lokal: http://localhost:3000
- LAN: http://[BILGISAYAR_IP]:3000

### IP Adresinizi Öğrenmek İçin:
**Windows:**
```cmd
ipconfig
```

**Linux/Mac:**
```bash
ifconfig
```

## 📁 Proje Yapısı

```
AI-ocr-FILE_EXPLORER/
├── backend/                 # Python FastAPI backend
│   ├── main.py             # Ana backend uygulaması
│   ├── requirements.txt    # Python bağımlılıkları
│   └── README.md
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React bileşenleri
│   │   ├── services/       # API servisleri
│   │   └── App.js         # Ana uygulama
│   ├── package.json
│   └── public/
├── uploads/               # Yüklenen dosyalar
├── database/             # SQLite veritabanı
└── README.md
```

## 📖 API Endpoints

- `POST /upload` - Dosya yükle
- `GET /files` - Dosyaları listele/ara (?query=arama_terimi)
- `GET /files/{file_id}` - Dosya bilgilerini al
- `GET /download/{file_id}` - Dosya indir
- `DELETE /files/{file_id}` - Dosya sil

## 🔍 Desteklenen Dosya Türleri

- **Resimler**: JPG, JPEG, PNG, BMP, TIFF
- **Belgeler**: PDF
- **Tablolar**: XLSX, XLS, CSV

## 💾 Veritabanı Yapısı

### files tablosu
- id (TEXT) - İşlem ID'si
- original_name (TEXT) - Orijinal dosya adı
- file_name (TEXT) - Sistem dosya adı
- file_size (INTEGER) - Dosya boyutu
- file_type (TEXT) - Dosya türü
- upload_date (TEXT) - Yükleme tarihi
- file_path (TEXT) - Dosya yolu

### ocr_content tablosu
- id (TEXT) - OCR kayıt ID'si
- file_id (TEXT) - Dosya ID'si (Foreign Key)
- content (TEXT) - OCR ile çıkarılan içerik
- extraction_date (TEXT) - Çıkarma tarihi

## 🔧 Geliştirme

### Backend Geliştirme
```bash
cd backend
# Geliştirme modu (auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Geliştirme
```bash
cd frontend
npm start
```

## 🐛 Sorun Giderme

### OCR Çalışmıyor
1. Tesseract'ın doğru kurulduğunu kontrol edin: `tesseract --version`
2. PATH'e eklendiğinden emin olun
3. Türkçe dil paketinin yüklü olduğunu kontrol edin

### LAN'dan Erişim Sağlanamıyor
1. Windows Firewall'da 8000 ve 3000 portlarını açın
2. Bilgisayarın IP adresini doğru aldığınızdan emin olun
3. Aynı ağda olduğunuzu kontrol edin

### Dosya Yükleme Hatası
1. `uploads` klasörünün yazma iznine sahip olduğunu kontrol edin
2. Dosya boyutu limitini kontrol edin
3. Desteklenen dosya türü olduğundan emin olun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.