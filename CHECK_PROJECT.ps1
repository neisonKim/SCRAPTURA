Write-Host "=== SCRAPTURA v2.2 CHECK ==="
$files=@("package.json","tsconfig.json","app\layout.tsx","components\Header.tsx","components\Footer.tsx","components\Hero.tsx","data\content.ts")
foreach($f in $files){if(Test-Path $f){Write-Host "[OK] $f" -ForegroundColor Green}else{Write-Host "[MISSING] $f" -ForegroundColor Red}}
