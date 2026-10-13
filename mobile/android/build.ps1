param(
    [ValidateSet("debug", "release", "bundle")]
    [string]$Variant = "debug"
)

$ErrorActionPreference = "Stop"
$androidRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not (Get-Command gradle -ErrorAction SilentlyContinue)) {
    throw "Gradle 8.9+ is required. Install Android Studio or add Gradle to PATH."
}
if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    throw "JDK 17 is required. Install Android Studio's JDK or set JAVA_HOME."
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js 20+ is required to verify the public production website."
}
if ($Variant -eq "debug" -and $env:IBNK_DEBUG_URL -and $env:IBNK_DEBUG_URL -notmatch "^https://") {
    throw "IBNK_DEBUG_URL must use HTTPS."
}

$gradleVersion = (& gradle --version 2>&1 | Out-String)
if ($LASTEXITCODE -ne 0 -or $gradleVersion -notmatch "(?m)^Gradle 8\.9$") {
    throw "Gradle 8.9 is required for reproducible Android builds."
}

$task = switch ($Variant) {
    "debug" { ":app:assembleDebug" }
    "release" { ":app:assembleRelease" }
    "bundle" { ":app:bundleRelease" }
}

Push-Location $androidRoot
try {
    & gradle $task --no-daemon
    if ($LASTEXITCODE -ne 0) {
        throw "Gradle task $task failed with exit code $LASTEXITCODE."
    }
} finally {
    Pop-Location
}
