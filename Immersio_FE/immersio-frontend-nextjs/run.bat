@echo off
start /b cmd /c next dev -p 9090 & local-ssl-proxy --source 4001 --target 9090