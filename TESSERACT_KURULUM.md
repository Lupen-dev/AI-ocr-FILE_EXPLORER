# TESSERACT OCR KURULUM REHBERİ

## Windows için Tesseract OCR Kurulumu

### 1. Tesseract İndirme
https://github.com/UB-Mannheim/tesseract/wiki adresinden Windows installer'ını indirin.

### 2. Kurulum Adımları
1. İndirilen .exe dosyasını çalıştırın
2. Kurulum sırasında "Additional language data (download)" seçeneğini işaretleyin
3. Language packs kısmında şunları seçin:
   - Turkish (tur)
   - English (eng)
4. "Add Tesseract to environment variables" seçeneğini işaretleyin
5. Kurulumu tamamlayın

### 3. Manuel PATH Ekleme (Gerekirse)
Eğer otomatik PATH ekleme çalışmazsa:
1. Windows + R tuşlarına basın
2. "sysdm.cpl" yazın ve Enter'a basın
3. "Advanced" sekmesine geçin
4. "Environment Variables" butonuna tıklayın
5. System variables kısmından "Path" seçin ve "Edit" tıklayın
6. "New" butonuna tıklayın
7. Tesseract kurulum dizinini ekleyin (genellikle: C:\Program Files\Tesseract-OCR)
8. Tüm pencereleri "OK" ile kapatın

### 4. Kurulum Testi
Yeni bir Command Prompt veya PowerShell açın ve şunu yazın:
```
tesseract --version
```

### 5. Türkçe Dil Paketi Kontrolü
```
tesseract --list-langs
```
Bu komut çıktısında "tur" ve "eng" görmeniz gerekiyor.

## Alternatif Kurulum Yöntemi (Chocolatey)
Eğer Chocolatey kuruluysa:
```
choco install tesseract
```

## Hızlı Test
Tesseract kurulduktan sonra bu komutu test edebilirsiniz:
```
echo "Test" | tesseract stdin stdout
```