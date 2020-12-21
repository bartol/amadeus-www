cd C:\Users\bd\Desktop\amadeus-dashboard\code
for /f "delims=" %%a in (' powershell -c "get-date -format yyyy-MM-dd_HH-mm-ss" ') do set "DATETIME=%%a"
venv\Scripts\python.exe update.py 2>&1 | .\win\tee.bat C:\Users\bd\Desktop\amadeus-dashboard\logs\update\%DATETIME%.log
