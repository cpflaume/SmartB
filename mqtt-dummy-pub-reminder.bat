@echo off

set topic="Show_Reminder"

set mosquitto_pub="E:\Program Files (x86)\mosquitto\mosquitto_pub.exe"
set timeout_seconds=10

if NOT "%1"=="" (
    set mosquitto_pub=%1
)

echo "publishing dummy data to %topic%"

:loop

   echo "publishing ON to topic %topic%
   %mosquitto_pub% -t %topic% -m "ON"
   timeout  /t %timeout_seconds% >nul 2>&1

   echo "publishing  OFF to topic %topic%
   %mosquitto_pub% -t %topic% -m "OFF"
   timeout  /t %timeout_seconds% >nul 2>&1


goto loop



