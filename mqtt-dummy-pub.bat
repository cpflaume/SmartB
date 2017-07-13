@echo off

set topic="SmartBottle"
set topic2="DrinkingValue"
set mosquitto_pub="E:\Program Files (x86)\mosquitto\mosquitto_pub.exe"
set timeout_seconds=2

if NOT "%1"=="" (
    set mosquitto_pub=%1
)

echo "publishing dummy data to %topic%"

:loop

for /l %%x in (0, 10, 100) do (
   echo "publishing  %%x to topic %topic% & %topic2%"
   %mosquitto_pub% -t %topic% -m "%%x"
   # %mosquitto_pub% -t %topic2% -m "%%x"
   timeout  /t %timeout_seconds% >nul 2>&1
)

for /l %%x in (100, -10, 0) do (
    echo "publishing  %%x to topic %topic% & %topic2%"
    %mosquitto_pub% -t %topic% -m "%%x"
    # %mosquitto_pub% -t %topic2% -m "%%x"
    timeout  /t %timeout_seconds% >nul 2>&1
)

goto loop



