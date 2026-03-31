@echo off
chcp 65001 >nul
echo ====================================
echo  UI/UX 设计师作品集网站
echo ====================================
echo.

REM 检查 node 进程
tasklist | find "node" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [提示] 开发服务器未运行，正在启动...
    echo.
    start powershell -NoExit -Command "cd '%~dp0'; npm run dev"
    echo [成功] 开发服务器已启动！
    echo.
    echo 正在打开浏览器...
    timeout /t 5 /nobreak >nul
    start http://localhost:3000
    echo.
    echo ====================================
    echo  网站已在浏览器中打开
    echo  按 Ctrl+C 可停止服务器
    echo ====================================
) else (
    echo [成功] 开发服务器已在运行
    echo.
    echo 正在打开浏览器...
    start http://localhost:3000
    echo.
    echo ====================================
    echo  网站已在浏览器中打开
    echo ====================================
)

echo.
echo 本地访问地址：http://localhost:3000
echo 资源导航页：http://localhost:3000/resources
echo.

pause
