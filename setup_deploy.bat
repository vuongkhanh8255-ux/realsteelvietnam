@echo off
chcp 65001 >nul
echo.
echo ============================================
echo   REAL STEEL — LANDING PAGE DEPLOY SETUP
echo ============================================
echo.

REM ── Kiểm tra Git ──
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Git chua duoc cai dat!
    echo Tai tai: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM ── Kiểm tra Node / npm ──
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Node.js chua duoc cai dat!
    echo Tai tai: https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Git va Node.js da san sang.
echo.

REM ── Di chuyen vao thu muc Landing Page ──
cd /d "C:\Users\ASUS\Desktop\LANDING PAGE"
echo [OK] Dang o thu muc: %CD%
echo.

REM ── Cai Vercel CLI neu chua co ──
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Dang cai Vercel CLI...
    npm install -g vercel
)

REM ── Tao .gitignore ──
echo node_modules/ > .gitignore
echo .vercel/ >> .gitignore
echo *.bak >> .gitignore
echo [OK] Da tao .gitignore

REM ── Tao vercel.json cho static site ──
echo { > vercel.json
echo   "buildCommand": null, >> vercel.json
echo   "outputDirectory": ".", >> vercel.json
echo   "framework": null, >> vercel.json
echo   "headers": [ >> vercel.json
echo     { >> vercel.json
echo       "source": "/(.*)", >> vercel.json
echo       "headers": [ >> vercel.json
echo         { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" } >> vercel.json
echo       ] >> vercel.json
echo     }, >> vercel.json
echo     { >> vercel.json
echo       "source": "/index.html", >> vercel.json
echo       "headers": [ >> vercel.json
echo         { "key": "Cache-Control", "value": "no-cache" } >> vercel.json
echo       ] >> vercel.json
echo     } >> vercel.json
echo   ] >> vercel.json
echo } >> vercel.json
echo [OK] Da tao vercel.json

REM ── Init Git ──
if not exist ".git" (
    git init
    echo [OK] Da init git repo
) else (
    echo [OK] Git repo da ton tai
)

REM ── Config git user neu chua co ──
git config user.email >nul 2>&1
if %errorlevel% neq 0 (
    git config user.email "khanh.vuong@stellakinetics.com"
    git config user.name "khanh"
)

REM ── Commit ──
git add -A
git commit -m "feat: initial landing page Real Steel Vietnam"
echo [OK] Da commit tat ca file

echo.
echo ============================================
echo   BUOC TIEP THEO — TAO GITHUB REPO
echo ============================================
echo.
echo 1. Mo GitHub va tao repo moi:
echo    https://github.com/new
echo.
echo    Ten repo: real-steel-landing
echo    Chon: Public
echo    KHONG check "Add README"
echo    Bam "Create repository"
echo.
echo 2. Sau khi tao xong, chay tiep lenh duoi:
echo    (Thay USERNAME bang GitHub username cua may)
echo.
echo    git remote add origin https://github.com/USERNAME/real-steel-landing.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Sau khi push xong, chay:
echo    vercel --prod
echo    (Login bang tai khoan Vercel cua may)
echo.
echo 4. Sau khi Vercel deploy xong, chay:
echo    vercel domains add realsteelvietnam.io.vn
echo.
echo ============================================
pause
