# iBNK mobile applications

Android and iOS use native WebViews to load the existing iBNK website. Product
catalog, accounts, delivery checks, cart, checkout, and order history remain
owned by the website; the apps do not ship a second storefront.

## Production origin is a release prerequisite

The intended domain is `https://ibnk.online`, but it must not be used for a
release until it serves the Vercel production application. At scaffold time it
resolved to a Hostinger parked-domain page and Vercel reported that the domain
was not assigned to the linked project. The Vercel deployment URL was protected
by Vercel authentication and is not a public app origin.

After the domain is connected to Vercel and verified publicly:

- Set `IBNK_PRODUCTION_URL` to the canonical HTTPS origin (for example,
  `https://ibnk.online`) in the build environment.
- Configure the matching domain allowlist/associated-domain records before
  enabling external app links.
- Keep API keys, signing keys, and store credentials out of this repository.

Android release tasks fail unless a public HTTPS origin and Android signing
credentials are provided. The iOS archive script also requires an explicit
production origin. Debug builds never use localhost by default; a development
origin must be explicitly passed with `IBNK_DEBUG_URL`.

## Android

Requirements: Android Studio with Android SDK 35, JDK 17, Node.js 20+, and
Gradle 8.9. Open `mobile/android` in Android Studio, or run from the repository
root:

```powershell
$env:IBNK_PRODUCTION_URL = "https://ibnk.online"
$env:ANDROID_KEYSTORE_PATH = "C:\secure\ibnk-release.jks"
$env:ANDROID_KEYSTORE_PASSWORD = "<from secret manager>"
$env:ANDROID_KEY_ALIAS = "<release alias>"
$env:ANDROID_KEY_PASSWORD = "<from secret manager>"
.\mobile\android\build.ps1 -Variant debug
.\mobile\android\build.ps1 -Variant release
.\mobile\android\build.ps1 -Variant bundle
```

The debug APK is written to `mobile/android/app/build/outputs/apk/debug/`.
Signed release APK and AAB files are written under
`mobile/android/app/build/outputs/`. Signing values are read from process
environment variables only and are never written to Gradle files.

## iOS

Requirements: macOS, Xcode 16 or newer, XcodeGen 2.42 or newer, Node.js 20+,
an Apple Developer team, and an App Store Connect record. Windows cannot build
or sign iOS apps.

```sh
export IBNK_PRODUCTION_URL="https://ibnk.online"
./mobile/ios/build.sh simulator
./mobile/ios/build.sh archive
./mobile/ios/build.sh ipa
```

Set `APPLE_TEAM_ID` for archive/IPA modes and `EXPORT_OPTIONS_PLIST` for IPA
export. Exporting requires a valid Apple distribution identity, provisioning
profile, and App Store Connect export options. Open the generated project in
Xcode to finish signing. Upload the signed archive through Xcode Organizer or
the authenticated App Store Connect workflow. A basic WebView wrapper is not
guaranteed App Store approval; review the current minimum functionality
requirements and test native navigation, sharing, location permission, offline
recovery, and payment flows before submission.

## Website synchronization and behavior

Each app requests the current site origin on launch and uses HTTP revalidation
for HTML navigations and explicit retries. Normal browser caching is retained
for versioned Next.js assets. No service worker or downloaded remote code is
added by the mobile shell. No background refresh runs during a checkout or
payment flow. WebView cookies and website storage use their persistent default
stores to retain supported sessions and cart state.

`checkout.stripe.com` stays in the WebView so the website's existing checkout
return URLs continue to work. Other external links open in the system browser.
The website's existing device-location flow is used; native location permission
is requested only when the page invokes browser geolocation after a user action.
Manual PIN-code/address entry remains available on the website when permission
is declined.

External universal/app links are not enabled yet. They require verified
`assetlinks.json` and Apple App Site Association records for the production
domain, plus the final Android signing fingerprint and Apple team configuration.

## Release status

No APK, AAB, IPA, TestFlight build, or store listing is included or claimed by
this source scaffold. The production domain is not currently serving the
application, and this Windows machine does not have Android Studio/JDK/ADB or
macOS/Xcode. Device validation, release signing, domain reassignment, and store
publishing must be completed before publishing download links.

To publish verified download links on the website, set the server-side
`ANDROID_APP_DOWNLOAD_URL` / `ANDROID_APP_VERSION` and
`IOS_APP_DISTRIBUTION_URL` / `IOS_APP_VERSION` values to the final HTTPS APK and
App Store/TestFlight destinations and release versions, then deploy the
website. A link is withheld unless both its HTTPS destination and version are
valid.
