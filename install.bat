@echo off
echo =======================================
echo AI OCR File Explorer - Tam Kurulum
echo =======================================

echo.
echo Bu script backend ve frontend'i kuracak.
echo Devam etmek icin bir tusa basin...
pause

echo.
echo 1. Backend kuruluyor...
call setup-backend.bat

echo.
echo 2. Frontend kuruluyor...
call setup-frontend.bat

echo.
echo =======================================
echo KURULUM TAMAMLANDI!
echo =======================================
echo.
echo Backend baslatmak icin: start-backend.bat
echo Frontend baslatmak icin: start-frontend.bat
echo.
echo Her iki servisi de ayri terminal pencerelerinde calistirin.
echo.
pause