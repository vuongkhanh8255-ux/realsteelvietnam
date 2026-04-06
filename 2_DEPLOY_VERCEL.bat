@echo off
chcp 65001 >nul
title Real Steel — Deploy Vercel + Domain

echo.
echo  ================================================
echo    DANG CAI VERCEL VA DEPLOY...
echo  ================================================
echo.

cd /d "C:\Users\ASUS\Desktop\LANDING PAGE"

REM Kiem tra npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Chua cai Node.js!
    echo Tai tai: https://nodejs.org roi chay lai file nay.
    pause
    exit /b 1
)

REM Cai Vercel CLI neu chua co
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Dang cai Vercel CLI...
    npm install -g vercel
    echo [OK] Da cai Vercel CLI
)

echo.
echo  [BUOC 1] Dang dang nhap Vercel...
echo  (Trinh duyet se mo ra - chon "Continue with GitHub")
echo.
vercel login

echo.
echo  [BUOC 2] Dang deploy len Vercel...
echo  - Chon: Y (set up and deploy)
echo  - Scope: chon team cua may (vuongkhanh8255-uxs-org)
echo  - Link to existing project? N
echo  - Project name: realsteelvietnam
echo  - Directory: ./  (nhan Enter)
echo.
vercel --prod

echo.
echo  [BUOC 3] Gan ten mien realsteelvietnam.io.vn...
vercel domains add realsteelvietnam.io.vn

echo.
echo  ================================================
echo    HOAN TAT!
echo.
echo    Vercel se hien thi DNS record can them.
echo    Chup anh man hinh va gui cho tao de tao
echo    huong dan them DNS vao nha cung cap ten mien.
echo  ================================================
echo.
pause
