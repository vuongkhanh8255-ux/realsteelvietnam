@echo off
chcp 65001 >nul
title Real Steel — Push to GitHub

echo.
echo  ================================================
echo    DANG DAY CODE LEN GITHUB...
echo  ================================================
echo.

cd /d "C:\Users\ASUS\Desktop\LANDING PAGE"

REM Tao vercel.json cho static site
echo { > vercel.json
echo   "buildCommand": null, >> vercel.json
echo   "outputDirectory": ".", >> vercel.json
echo   "framework": null >> vercel.json
echo } >> vercel.json

REM Tao .gitignore
echo .vercel/ > .gitignore
echo *.bak >> .gitignore

REM Init git neu chua co
if not exist ".git" (
    git init
    echo [OK] Khoi tao Git
)

REM Gan vao dung repo
git remote remove origin 2>nul
git remote add origin https://github.com/vuongkhanh8255-ux/realsteelvietnam.git

REM Config user
git config user.email "khanh.vuong@stellakinetics.com"
git config user.name "khanh"

REM Commit tat ca file
git add -A
git commit -m "feat: Real Steel Vietnam landing page"

REM Push
git branch -M main
git push -u origin main --force

echo.
echo  ================================================
echo    XONG! Code da len GitHub thanh cong!
echo    https://github.com/vuongkhanh8255-ux/realsteelvietnam
echo  ================================================
echo.
pause
