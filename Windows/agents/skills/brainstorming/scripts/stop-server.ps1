param(
  [Parameter(Mandatory = $true)]
  [string]$ScreenDir
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($ScreenDir)) {
  Write-Output '{"error": "Usage: stop-server.ps1 -ScreenDir <screen_dir>"}'
  exit 1
}

$PidFile = Join-Path $ScreenDir ".server.pid"
$LogFile = Join-Path $ScreenDir ".server.log"
$ErrorLogFile = Join-Path $ScreenDir ".server.err.log"

if (Test-Path $PidFile) {
  $RawPid = Get-Content $PidFile -Raw
  $ServerPid = [int]$RawPid.Trim()

  Stop-Process -Id $ServerPid -ErrorAction SilentlyContinue

  for ($i = 0; $i -lt 20; $i++) {
    $Process = Get-Process -Id $ServerPid -ErrorAction SilentlyContinue
    if (-not $Process) {
      break
    }
    Start-Sleep -Milliseconds 100
  }

  $Process = Get-Process -Id $ServerPid -ErrorAction SilentlyContinue
  if ($Process) {
    Stop-Process -Id $ServerPid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 100
  }

  $Process = Get-Process -Id $ServerPid -ErrorAction SilentlyContinue
  if ($Process) {
    Write-Output '{"status": "failed", "error": "process still running"}'
    exit 1
  }

  Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
  Remove-Item $LogFile -Force -ErrorAction SilentlyContinue
  Remove-Item $ErrorLogFile -Force -ErrorAction SilentlyContinue

  $TempRoot = [System.IO.Path]::GetFullPath($env:TEMP)
  $FullScreenDir = [System.IO.Path]::GetFullPath($ScreenDir)
  if ($FullScreenDir.StartsWith($TempRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    Remove-Item $ScreenDir -Recurse -Force -ErrorAction SilentlyContinue
  }

  Write-Output '{"status": "stopped"}'
} else {
  Write-Output '{"status": "not_running"}'
}
