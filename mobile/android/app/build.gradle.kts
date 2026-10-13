import java.net.URI

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

val productionOrigin = providers.gradleProperty("ibnkProductionUrl")
    .orElse(providers.environmentVariable("IBNK_PRODUCTION_URL"))
    .orNull
    ?.trim()
    .orEmpty()
val debugOrigin = providers.gradleProperty("ibnkDebugUrl")
    .orElse(providers.environmentVariable("IBNK_DEBUG_URL"))
    .orElse("https://ibnk.online")
    .get()
    .trim()

fun isSafeProductionOrigin(value: String): Boolean {
    val uri = runCatching { URI(value) }.getOrNull() ?: return false
    val host = uri.host?.lowercase() ?: return false
    return uri.scheme == "https" &&
        uri.userInfo == null &&
        uri.query == null &&
        uri.fragment == null &&
        uri.path.orEmpty().let { it.isEmpty() || it == "/" } &&
        host != "localhost" &&
        !host.endsWith(".localhost") &&
        !host.endsWith(".local") &&
        !host.endsWith(".vercel.app") &&
        !host.contains(":") &&
        !host.matches(Regex("""\d{1,3}(?:\.\d{1,3}){3}""")) &&
        !host.matches(Regex("""(?:0|10|127|169\.254)\.\d{1,3}\.\d{1,3}\.\d{1,3}""")) &&
        !host.matches(Regex("""192\.168\.\d{1,3}\.\d{1,3}""")) &&
        !host.matches(Regex("""172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}""")) &&
        !host.matches(Regex("""100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d{1,3}\.\d{1,3}"""))
}

val signingPath = providers.environmentVariable("ANDROID_KEYSTORE_PATH").orNull
val signingStorePassword = providers.environmentVariable("ANDROID_KEYSTORE_PASSWORD").orNull
val signingAlias = providers.environmentVariable("ANDROID_KEY_ALIAS").orNull
val signingKeyPassword = providers.environmentVariable("ANDROID_KEY_PASSWORD").orNull
val hasSigningCredentials = listOf(
    signingPath,
    signingStorePassword,
    signingAlias,
    signingKeyPassword
).all { !it.isNullOrBlank() }

android {
    namespace = "online.ibnk.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "online.ibnk.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
        buildConfigField("String", "WEB_ORIGIN", "\"$debugOrigin\"")
    }

    buildFeatures {
        buildConfig = true
    }

    signingConfigs {
        if (hasSigningCredentials) {
            create("release") {
                storeFile = file(requireNotNull(signingPath))
                storePassword = signingStorePassword
                keyAlias = signingAlias
                keyPassword = signingKeyPassword
            }
        }
    }

    buildTypes {
        debug {
            buildConfigField("String", "WEB_ORIGIN", "\"$debugOrigin\"")
        }
        release {
            buildConfigField("String", "WEB_ORIGIN", "\"$productionOrigin\"")
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            if (hasSigningCredentials) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
    }
}

dependencies {
    implementation("androidx.activity:activity-ktx:1.10.1")
}

val validateReleaseConfiguration by tasks.registering {
    doLast {
        if (!isSafeProductionOrigin(productionOrigin)) {
            throw GradleException(
                "Set IBNK_PRODUCTION_URL to the verified public HTTPS origin. " +
                    "Local, private, and Vercel preview origins are not permitted."
            )
        }
        val originCheck = ProcessBuilder(
            "node",
            File(rootDir.parentFile, "scripts/verify-production-origin.mjs").absolutePath,
            productionOrigin
        )
            .directory(rootDir.parentFile.parentFile)
            .inheritIO()
            .start()
        if (originCheck.waitFor() != 0) {
            throw GradleException("The configured origin did not pass live production verification.")
        }
        if (!hasSigningCredentials || !file(requireNotNull(signingPath)).isFile) {
            throw GradleException(
                "Set ANDROID_KEYSTORE_PATH, ANDROID_KEYSTORE_PASSWORD, " +
                    "ANDROID_KEY_ALIAS, and ANDROID_KEY_PASSWORD using a secure secret store."
            )
        }
    }
}

tasks.matching { it.name == "assembleRelease" || it.name == "bundleRelease" }
    .configureEach {
        dependsOn(validateReleaseConfiguration)
    }
