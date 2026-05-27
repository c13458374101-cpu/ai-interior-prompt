$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$git = "C:\Users\24979\Documents\Codex\tools\mingit\cmd\git.exe"
$repo = "C:/Users/24979/Documents/Codex/2026-05-26/new-chat-9"

Write-Host "Push this project to GitHub"
Write-Host ""
Write-Host "Repository: https://github.com/c13458374101-cpu/ai-interior-prompt.git"
Write-Host ""
Write-Host "Paste a GitHub Personal Access Token when prompted."
Write-Host "The token input is masked and is not written to the project."
Write-Host ""

$secureToken = Read-Host "GitHub token" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)
$askPass = Join-Path $env:TEMP "codex-git-askpass.cmd"

try {
  $plainToken = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  if ([string]::IsNullOrWhiteSpace($plainToken)) {
    throw "GitHub token cannot be empty."
  }

  @"
@echo off
set "prompt=%~1"
echo %prompt% | findstr /i "Username" >nul
if %errorlevel%==0 (
  echo x-access-token
) else (
  echo %GITHUB_PUSH_TOKEN%
)
"@ | Set-Content -LiteralPath $askPass -Encoding ASCII

  $env:GIT_ASKPASS = $askPass
  $env:GITHUB_PUSH_TOKEN = $plainToken
  $env:GIT_TERMINAL_PROMPT = "0"

  & $git -c safe.directory=$repo push -u origin main
  if ($LASTEXITCODE -ne 0) {
    throw "git push failed with exit code $LASTEXITCODE."
  }

  Write-Host ""
  Write-Host "Push completed."
} finally {
  Remove-Item Env:\GITHUB_PUSH_TOKEN -ErrorAction SilentlyContinue
  Remove-Item Env:\GIT_ASKPASS -ErrorAction SilentlyContinue
  Remove-Item Env:\GIT_TERMINAL_PROMPT -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $askPass -Force -ErrorAction SilentlyContinue
  if ($bstr -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
}

Write-Host ""
Read-Host "Press Enter to close"
