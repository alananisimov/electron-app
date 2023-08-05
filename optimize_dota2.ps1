
  $gamePath = "123"
  Write-Host "Оптимизация Dota 2 в пути: $gamePath"
  $steamAppsPath = $gamePath
$dota2CachePath = Join-Path -Path $steamAppsPath -ChildPath "game%5Cdota%5Ccache"
Remove-Item -Path $dota2CachePath -Recurse -Force

# Удаление лишних файлов Dota 2
$dota2Path = Join-Path -Path $steamAppsPath -ChildPath "dota 2 beta"
$unwantedFiles = @("gamestate_integration", "debug.log")
foreach ($file in $unwantedFiles) {
    $filePath = Join-Path -Path $dota2Path -ChildPath $file
    if (Test-Path -Path $filePath) {
        Remove-Item -Path $filePath -Force
    }
}

Write-Host "Очистка кэша Dota 2 и удаление лишних файлов завершено."
# Очистка кэша CS:GO
$steamAppsPath = "%6012"
$csgoCachePath = Join-Path -Path $steamAppsPath -ChildPath "csgo%5Ccache"
Remove-Item -Path $csgoCachePath -Recurse -Force

# Удаление лишних файлов CS:GO
$csgoPath = Join-Path -Path $steamAppsPath -ChildPath "csgo"
$unwantedFiles = @("temp", "demo.dem", "console.log")
foreach ($file in $unwantedFiles) {
    $filePath = Join-Path -Path $csgoPath -ChildPath $file
    if (Test-Path -Path $filePath) {
        Remove-Item -Path $filePath -Force
    }
}

Write-Host "Очистка кэша CS:GO и удаление лишних файлов завершено."
$currentUserTempPath = [System.IO.Path]::GetTempPath()
Remove-Item -Path $currentUserTempPath* -Recurse -Force

# Очистка временных файлов в папке "Temporary Internet Files"
$ieCachePath = "$env:USERPROFILEAppDataLocalMicrosoftWindowsINetCache"
Remove-Item -Path $ieCachePath* -Recurse -Force

# Очистка временных файлов в папке "Recent"
$recentFilesPath = "$env:USERPROFILEAppDataRoamingMicrosoftWindowsRecent"
Remove-Item -Path $recentFilesPath* -Recurse -Force
Clear-IECache -Confirm:$false
Clear-RecycleBin -Force
wevtutil.exe cl Application
wevtutil.exe cl Security
wevtutil.exe cl System
Clear-PackageSource
$chromeCachePath = "$env:LOCALAPPDATAGoogleChromeUser DataDefaultCache"
if (Test-Path -Path $chromeCachePath) {
    Remove-Item -Path $chromeCachePath -Recurse -Force
}

# Очистка кэша браузера Mozilla Firefox
$firefoxCachePath = "$env:LOCALAPPDATAMozillaFirefoxProfiles*cache2"
if (Test-Path -Path $firefoxCachePath) {
    Remove-Item -Path $firefoxCachePath -Recurse -Force
}
Write-Host "Очистка временных файлов завершена."
  