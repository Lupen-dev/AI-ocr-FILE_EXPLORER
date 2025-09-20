@echo off
echo =======================================
echo AI OCR File Explorer - Frontend Setup
echo =======================================

echo.
echo Node.js versiyonu kontrol ediliyor...
node --version
if %errorlevel% neq 0 (
    echo HATA: Node.js yuklu degil veya PATH'e eklenmemis!
    echo Node.js 16+ yukleyip PATH'e ekleyin.
    pause
    exit /b 1
)

echo.
echo npm versiyonu kontrol ediliyor...
npm --version

echo.
echo Frontend dizinine geciliyor...
cd frontend

echo.
echo Node.js paketleri yukluyor...
npm install

echo.
echo =======================================
echo Frontend hazir! Baslatmak icin:
echo npm start
echo =======================================
pause