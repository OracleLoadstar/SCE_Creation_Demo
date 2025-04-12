@echo off

:main
powershell cat .\version.txt
call :fetch_version
echo %version_name% > .\version.txt
echo %version_name% > .\version_info\last_version.txt
git add . -v
git commit -m %commit%
git push -v
goto eof
:fetch_version
set /p version_name="请提供版本号："
set /p commit="请提供commit："

:eof