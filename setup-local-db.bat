@echo off
echo Setting up local DynamoDB tables...

cd server

echo Creating tables from demo-tables.txt...
for /f "delims=^" %%i in (demo-tables.txt) do (
    echo Executing: %%i
    call %%i
    if errorlevel 1 (
        echo Command failed, continuing...
    )
)

echo.
echo Local DynamoDB tables setup completed!
pause