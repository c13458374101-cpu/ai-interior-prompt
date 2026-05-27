$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Configure OpenAI API key for this project"
Write-Host ""
Write-Host "Your input is masked and will be saved only to .env.local in this folder."
Write-Host ""

$secureKey = Read-Host "Paste OPENAI_API_KEY" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)

try {
  $plainKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  if ([string]::IsNullOrWhiteSpace($plainKey)) {
    throw "OPENAI_API_KEY cannot be empty."
  }

  $content = @(
    "OPENAI_API_KEY=$plainKey"
    "OPENAI_MODEL=gpt-5.4-mini"
  )

  Set-Content -LiteralPath ".env.local" -Value $content -Encoding UTF8
  Write-Host ""
  Write-Host ".env.local has been created."
  Write-Host "Restart the website with start-site.cmd."
} finally {
  if ($bstr -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
}

Write-Host ""
Read-Host "Press Enter to close"
