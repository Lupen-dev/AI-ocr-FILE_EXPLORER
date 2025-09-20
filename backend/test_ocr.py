#!/usr/bin/env python3
"""
OCR Test Script
Tesseract kurulumunu ve OCR fonksiyonlarını test eder
"""

import os
import sys
from pathlib import Path

# Backend modüllerini import et
sys.path.append(str(Path(__file__).parent))
from main import extract_text_from_file, init_database

def test_tesseract():
    """Tesseract kurulumunu test et"""
    try:
        import pytesseract
        from PIL import Image
        
        # Basit OCR testi
        print("🔍 Tesseract OCR testi yapılıyor...")
        
        # Test için küçük bir resim oluştur
        img = Image.new('RGB', (200, 50), color='white')
        
        # Tesseract versiyonunu kontrol et
        version = pytesseract.get_tesseract_version()
        print(f"✅ Tesseract versiyon: {version}")
        
        # Dil paketlerini kontrol et
        langs = pytesseract.get_languages()
        print(f"📚 Mevcut dil paketleri: {langs}")
        
        if 'tur' in langs:
            print("✅ Türkçe dil paketi mevcut")
        else:
            print("⚠️ Türkçe dil paketi bulunamadı")
            
        if 'eng' in langs:
            print("✅ İngilizce dil paketi mevcut")
        else:
            print("⚠️ İngilizce dil paketi bulunamadı")
            
        return True
        
    except Exception as e:
        print(f"❌ Tesseract testi başarısız: {e}")
        return False

def test_database():
    """Veritabanı kurulumunu test et"""
    try:
        print("\n📊 Veritabanı testi yapılıyor...")
        init_database()
        print("✅ Veritabanı başarıyla oluşturuldu")
        return True
    except Exception as e:
        print(f"❌ Veritabanı testi başarısız: {e}")
        return False

def create_test_image():
    """Test için örnek resim oluştur"""
    try:
        from PIL import Image, ImageDraw, ImageFont
        
        print("\n🖼️ Test resmi oluşturuluyor...")
        
        # Test resmi oluştur
        img = Image.new('RGB', (400, 200), color='white')
        draw = ImageDraw.Draw(img)
        
        # Metin ekle
        text = "Bu bir OCR testidir\nTest successful!\n2024 yılında oluşturuldu"
        
        try:
            # Sistem fontunu kullanmaya çalış
            font = ImageFont.load_default()
        except:
            font = None
            
        draw.text((20, 50), text, fill='black', font=font)
        
        # Test dizini oluştur
        test_dir = Path("test_files")
        test_dir.mkdir(exist_ok=True)
        
        # Resmi kaydet
        test_image_path = test_dir / "test_image.png"
        img.save(test_image_path)
        print(f"✅ Test resmi oluşturuldu: {test_image_path}")
        
        return test_image_path
        
    except Exception as e:
        print(f"❌ Test resmi oluşturulamadı: {e}")
        return None

async def test_ocr_extraction():
    """OCR çıkarma fonksiyonunu test et"""
    try:
        print("\n🔍 OCR çıkarma testi yapılıyor...")
        
        # Test resmi oluştur
        test_image = create_test_image()
        if not test_image:
            return False
            
        # OCR ile metin çıkar
        extracted_text = await extract_text_from_file(test_image, '.png')
        print(f"📝 Çıkarılan metin:\n{extracted_text}")
        
        if extracted_text and "OCR" in extracted_text:
            print("✅ OCR başarıyla çalışıyor")
            return True
        else:
            print("⚠️ OCR çıkarma kısmen başarılı (metin bulunamadı veya eksik)")
            return False
            
    except Exception as e:
        print(f"❌ OCR testi başarısız: {e}")
        return False

def main():
    """Ana test fonksiyonu"""
    print("=" * 50)
    print("🚀 AI OCR File Explorer - Sistem Testi")
    print("=" * 50)
    
    # Test sonuçları
    results = []
    
    # 1. Tesseract testi
    results.append(("Tesseract OCR", test_tesseract()))
    
    # 2. Veritabanı testi
    results.append(("Veritabanı", test_database()))
    
    # 3. OCR çıkarma testi (async)
    import asyncio
    ocr_result = asyncio.run(test_ocr_extraction())
    results.append(("OCR Çıkarma", ocr_result))
    
    # Sonuçları göster
    print("\n" + "=" * 50)
    print("📊 TEST SONUÇLARI")
    print("=" * 50)
    
    all_passed = True
    for test_name, result in results:
        status = "✅ BAŞARILI" if result else "❌ BAŞARISIZ"
        print(f"{test_name:20} : {status}")
        if not result:
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 TÜM TESTLER BAŞARILI! Sistem hazır.")
    else:
        print("⚠️ Bazı testler başarısız. Kurulum kontrol edilmeli.")
        print("\nÇözüm önerileri:")
        print("1. Tesseract OCR'ı yükleyin: https://github.com/UB-Mannheim/tesseract/wiki")
        print("2. Türkçe dil paketini yükleyin")
        print("3. PATH ortam değişkenini kontrol edin")
    print("=" * 50)

if __name__ == "__main__":
    main()