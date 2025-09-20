# AI OCR File Explorer - Backend

Bu backend servisi, dosya yükleme, OCR işleme ve dosya arama özelliklerini sağlar.

## Kurulum

1. Python 3.8+ gerekli
2. Gerekli paketleri yükle:
```bash
pip install -r requirements.txt
```

3. Tesseract OCR'ı yükle:
   - Windows: https://github.com/UB-Mannheim/tesseract/wiki
   - OCR için Türkçe dil paketini de yükle

## Çalıştırma

```bash
python main.py
```

Backend http://0.0.0.0:8000 adresinde çalışacak ve LAN üzerindeki tüm cihazlardan erişilebilir olacak.

## API Endpoints

- `POST /upload` - Dosya yükle
- `GET /files` - Dosyaları listele/ara
- `GET /files/{file_id}` - Dosya bilgilerini al
- `GET /download/{file_id}` - Dosya indir
- `DELETE /files/{file_id}` - Dosya sil

## Desteklenen Dosya Türleri

- Resimler: JPG, PNG, BMP, TIFF
- PDF dosyaları
- Excel dosyaları: XLSX, XLS
- CSV dosyaları

## OCR Özellikleri

- Resim dosyalarından metin çıkarma
- PDF'lerden metin çıkarma
- Excel/CSV dosyalarından içerik çıkarma
- Türkçe ve İngilizce dil desteği