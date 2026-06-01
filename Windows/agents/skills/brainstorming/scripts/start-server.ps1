param(
  [string]$ProjectDir = "",
  [string]$HostAddress = "127.0.0.1",
  [string]$UrlHost = "",
  [switch]$Foreground,
  [switch]$Background
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

if ([string]::IsNullOrWhiteSpace($UrlHost)) {
  if ($HostAddress -eq "127.0.0.1" -or $HostAddress -eq "localhost") {
    $UrlHost = "localhost"
  } else {
    $UrlHost = $HostAddress
  }
}

$SessionId = "$PID-$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())"

if (-not [string]::IsNullOrWhiteSpace($ProjectDir)) {
  $ScreenDir = Join-Path $ProjectDir ".superpowers\brainstorm\$SessionId"
} else {
  $ScreenDir = Join-Path $env:TEMP "brainstorm-$SessionId"
}

$PidFile = Join-Path $ScreenDir ".server.pid"
$LogFile = Join-Path $ScreenDir ".server.log"
$ErrorLogFile = Join-Path $ScreenDir ".server.err.log"

New-Item -ItemType Directory -Force -Path $ScreenDir | Out-Null

if (Test-Path $PidFile) {
  $OldPid = Get-Content $PidFile -Raw
  if (-not [string]::IsNullOrWhiteSpace($OldPid)) {
    Stop-Process -Id ([int]$OldPid) -ErrorAction SilentlyContinue
  }
  Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
}

Set-Location $ScriptDir

$env:BRAINSTORM_DIR = $ScreenDir
$env:BRAINSTORM_HOST = $HostAddress
$env:BRAINSTORM_URL_HOST = $UrlHost
$env:BRAINSTORM_OWNER_PID = ""

if ($Foreground -or (-not $Background)) {
  Set-Content -Path $PidFile -Value $PID
  node server.cjs
  exit $LASTEXITCODE
}

$Process = Start-Process -FilePath "node" -ArgumentList "server.cjs" -WorkingDirectory $ScriptDir -RedirectStandardOutput $LogFile -RedirectStandardError $ErrorLogFile -PassThru -WindowStyle Hidden
Set-Content -Path $PidFile -Value $Process.Id

for ($i = 0; $i -lt 50; $i++) {
  if (Test-Path $LogFile) {
    $StartedLine = Select-String -Path $LogFile -Pattern "server-started" -SimpleMatch | Select-Object -First 1
    if ($StartedLine) {
      Write-Output $StartedLine.Line
      exit 0
    }
  }
  Start-Sleep -Milliseconds 100
}

Write-Output '{"error": "Server failed to start within 5 seconds"}'
exit 1
