cd C:\Users\bdeak\Desktop\amadeus2.hr-master\dashboard
for /f "delims=" %%a in (' powershell -c "get-date -format yyyy-MM-dd_HH-mm-ss" ') do set "DATETIME=%%a"
venv\Scripts\python.exe gui.py 2>&1 | .\tee.exe C:\Users\bdeak\Desktop\baza-logovi\gui\%DATETIME%.log
