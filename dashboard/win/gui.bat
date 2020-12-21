cd C:\Users\bd\Desktop\amadeus-dashboard\code
for /f "delims=" %%a in (' powershell -c "get-date -format yyyy-MM-dd_HH-mm-ss" ') do set "DATETIME=%%a"
venv\Scripts\python.exe gui.py 2>&1 | .\win\tee.bat C:\Users\bd\Desktop\amadeus-dashboard\logs\gui\%DATETIME%.log
