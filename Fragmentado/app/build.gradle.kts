plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.example.fragmentado"
    compileSdk {
        version = release(37)
    }

    defaultConfig {
        applicationId = "com.example.fragmentado"
        minSdk = 27
        targetSdk = 37
        versionCode = 1
        versionName = "1.0"
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
}
