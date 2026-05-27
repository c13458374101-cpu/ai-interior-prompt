@echo off
cd /d "%~dp0"
if not exist ".env.local" (
  echo Warning: .env.local is missing.
  echo.
  echo The website will still open, but AI Optimize needs:
  echo OPENAI_API_KEY=your_api_key_here
  echo OPENAI_MODEL=gpt-5.4-mini
  echo.
)
echo Starting AI Interior Prompt Studio...
echo.
echo When the server is ready, open http://localhost:3000
echo Keep this window open while using the website.
echo.
npm.cmd run dev -- --hostname 0.0.0.0 --port 3000
pause
