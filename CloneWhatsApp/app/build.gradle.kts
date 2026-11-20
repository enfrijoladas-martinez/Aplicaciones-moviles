import java.util.Properties

plugins {
    alias(libs.plugins.android.application)
}

val locales = Properties().apply {
    val archivo = rootProject.file("local.properties")
    if (archivo.exists()) {
        archivo.inputStream().use { load(it) }
    }
}

val supabaseUrl: String = locales.getProperty("SUPABASE_URL")
    ?: "https://ypclpjtjhiirunieakuu.supabase.co"
val supabaseKey: String = locales.getProperty("SUPABASE_KEY")
    ?: "sb_publishable_JQFVYKHyIBAtW0Co-s8n-A_cHu38Z55"

android {
    namespace = "com.example.clonewhatsapp"
    compileSdk {
        version = release(37)
    }

    defaultConfig {
        applicationId = "com.example.clonewhatsapp"
        minSdk = 27
        targetSdk = 37
        versionCode = 1
        versionName = "1.0"

        buildConfigField("String", "SUPABASE_URL", "\"$supabaseUrl\"")
        buildConfigField("String", "SUPABASE_KEY", "\"$supabaseKey\"")
    }

    buildFeatures {
        buildConfig = true
    }

    buildTypes {
        release {
            optimization {
                enable = false
            }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

dependencies {
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.androidx.recyclerview)
    implementation(libs.androidx.activity)
    implementation(libs.okhttp)
}
