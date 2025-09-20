@echo off
echo ======================================
echo AI OCR File Explorer - Backend Setup
echo ======================================

echo.
echo Python versiyonu kontrol ediliyor...
python --version
if %errorlevel% neq 0 (
    echo HATA: Python yuklu degil veya PATH'e eklenmemis!
    echo Python 3.8+ yukleyip PATH'e ekleyin.
    pause
    exit /b 1
)

echo.
echo Tesseract OCR kontrol ediliyor...
tesseract --version
if %errorlevel% neq 0 (
    echo UYARI: Tesseract OCR yuklu degil!
    echo Lütfen Tesseract OCR'yi yukleyin: https://github.com/UB-Mannheim/tesseract/wiki
    echo Devam etmek için bir tusa basin...
    pause
)

echo.
echo Backend dizinine geciliyor...
cd backend

echo.
echo Python paketleri yukluyor...
pip install -r requirements.txt

echo.
echo ======================================
echo Backend hazir! Baslatmak icin:
echo python main.py
echo ======================================
pause