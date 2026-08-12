@echo off
setlocal
set "ROOT=%~dp0"
powershell.exe -NoProfile -WindowStyle Hidden -Command "$listener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1; if ($null -eq $listener) { Start-Process -WindowStyle Hidden -FilePath node.exe -ArgumentList 'scripts\serve-local-site.mjs','--open' -WorkingDirectory '%ROOT%' } else { Start-Process 'http://127.0.0.1:3000/' }"
