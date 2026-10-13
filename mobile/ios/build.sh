#!/bin/sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
MODE="${1:-simulator}"

command -v xcodegen >/dev/null 2>&1 || {
  echo "Install XcodeGen 2.42+ to generate the iOS project." >&2
  exit 2
}
command -v xcodebuild >/dev/null 2>&1 || {
  echo "Xcode is required to build iOS applications; this script must run on macOS." >&2
  exit 2
}

case "$MODE" in
  simulator)
    if [ -z "${IBNK_PRODUCTION_URL:-}${IBNK_DEBUG_URL:-}" ]; then
      echo "Set IBNK_PRODUCTION_URL or IBNK_DEBUG_URL for a simulator build." >&2
      exit 2
    fi
    if [ -n "${IBNK_PRODUCTION_URL:-}" ]; then
      node "$ROOT/../scripts/verify-production-origin.mjs" "$IBNK_PRODUCTION_URL"
    elif [ "${IBNK_DEBUG_URL#https://}" = "$IBNK_DEBUG_URL" ]; then
      echo "IBNK_DEBUG_URL must use HTTPS." >&2
      exit 2
    fi
    ;;
  archive|ipa)
    if [ -z "${IBNK_PRODUCTION_URL:-}" ]; then
      echo "IBNK_PRODUCTION_URL must be set to the verified public HTTPS origin." >&2
      exit 2
    fi
    node "$ROOT/../scripts/verify-production-origin.mjs" "$IBNK_PRODUCTION_URL"
    if [ -z "${APPLE_TEAM_ID:-}" ]; then
      echo "Set APPLE_TEAM_ID from the Apple Developer account for signed archives." >&2
      exit 2
    fi
    ;;
  *)
    echo "Usage: $0 [simulator|archive|ipa]" >&2
    exit 2
    ;;
esac

cd "$ROOT"
xcodegen generate --spec project.yml
case "$MODE" in
  simulator)
    xcodebuild -project iBNK.xcodeproj -scheme iBNK \
      -destination 'generic/platform=iOS Simulator' \
      IBNK_PRODUCTION_URL="${IBNK_PRODUCTION_URL:-}" \
      IBNK_DEBUG_URL="${IBNK_DEBUG_URL:-}" \
      CODE_SIGNING_ALLOWED=NO build
    ;;
  archive|ipa)
    mkdir -p "$ROOT/build"
    xcodebuild -project iBNK.xcodeproj -scheme iBNK \
      -destination 'generic/platform=iOS' \
      -archivePath "$ROOT/build/iBNK.xcarchive" \
      IBNK_PRODUCTION_URL="$IBNK_PRODUCTION_URL" \
      IBNK_DEBUG_URL="${IBNK_DEBUG_URL:-}" \
      DEVELOPMENT_TEAM="$APPLE_TEAM_ID" \
      archive
    if [ "$MODE" = "ipa" ]; then
      if [ -z "${EXPORT_OPTIONS_PLIST:-}" ] || [ ! -f "$EXPORT_OPTIONS_PLIST" ]; then
        echo "Set EXPORT_OPTIONS_PLIST to the App Store/TestFlight export options plist." >&2
        exit 2
      fi
      xcodebuild -exportArchive \
        -archivePath "$ROOT/build/iBNK.xcarchive" \
        -exportPath "$ROOT/build/export" \
        -exportOptionsPlist "$EXPORT_OPTIONS_PLIST"
    fi
    ;;
esac
