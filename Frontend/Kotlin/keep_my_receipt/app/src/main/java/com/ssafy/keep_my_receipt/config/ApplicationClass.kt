package com.ssafy.keep_my_receipt.config

import android.app.Application
import android.content.SharedPreferences
import android.text.InputFilter
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.ktx.Firebase
import com.ssafy.keep_my_receipt.util.SharedPreferencesUtil
import java.util.regex.Pattern

class ApplicationClass : Application() {

    companion object {
        lateinit var sSharedPreferences: SharedPreferencesUtil
        const val SHARED_PREFERENCES_NAME = "keep_my_receipt"
    }

    override fun onCreate() {
        sSharedPreferences = SharedPreferencesUtil(applicationContext)
        super.onCreate()
    }
}