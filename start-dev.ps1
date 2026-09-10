Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   GENERAL FAMILY TREE - LOCAL PREVIEW SERVER" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path $PSScriptRoot

$nodePath = "C:\Program Files\nodejs\node.exe"
if (-not (Test-Path $nodePath)) {
    $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeCmd) {
        $nodePath = $nodeCmd.Source
    } else {
        Write-Host "[Error] Node.js is not found!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Start-Process "http://localhost:3000"
Write-Host "Starting local web server on port 3000..." -ForegroundColor Green
Write-Host "Browser will open automatically at http://localhost:3000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C in this window to stop the server.`n" -ForegroundColor Gray

& $nodePath server.js