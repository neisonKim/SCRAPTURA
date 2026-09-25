$ErrorActionPreference = "Stop"

$Host.UI.RawUI.WindowTitle = "SCRAPTURA v2.3.1 Build Verify"

Write-Host ""
Write-Host "=== SCRAPTURA v2.3.1 BUILD VERIFY ===" -ForegroundColor Cyan
Write-Host ""

if (!(Test-Path ".\package.json")) {
    Write-Host "[FAIL] package.json을 찾을 수 없습니다." -ForegroundColor Red
    Write-Host "이 파일을 SCRAPTURA 프로젝트 최상위 폴더에 넣고 실행하세요."
    Read-Host "Enter를 누르면 종료합니다"
    exit 1
}

Write-Host "[1/4] Node / npm 확인" -ForegroundColor Yellow
node -v
npm -v

Write-Host ""
Write-Host "[2/4] 기존 빌드 캐시 정리" -ForegroundColor Yellow

if (Test-Path ".\.next") {
    Remove-Item ".\.next" -Recurse -Force
}

Write-Host ""
Write-Host "[3/4] 패키지 설치" -ForegroundColor Yellow

if (Test-Path ".\package-lock.json") {
    npm ci
} else {
    npm install
}

Write-Host ""
Write-Host "[4/4] Next.js production build" -ForegroundColor Yellow

npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host " BUILD PASS - v2.3.1 교체 후보 검증 완료" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "BUILD FAIL - 위 오류 내용을 그대로 ChatGPT에 보내주세요." -ForegroundColor Red
}

Write-Host ""
Read-Host "Enter를 누르면 종료합니다"