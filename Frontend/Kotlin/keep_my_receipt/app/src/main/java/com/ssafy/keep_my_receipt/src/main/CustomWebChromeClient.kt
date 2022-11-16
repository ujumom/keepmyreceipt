package com.ssafy.keep_my_receipt.src.main

import android.content.Context
import android.net.Uri
import android.os.Build
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebView
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import com.ssafy.keep_my_receipt.config.ApplicationClass
import com.ssafy.keep_my_receipt.config.BaseActivity
import com.ssafy.keep_my_receipt.databinding.ActivityMainBinding

import android.content.Intent
import androidx.core.app.ActivityCompat
import androidx.core.app.ActivityCompat.startActivityForResult as startActivityForResult


class CustomWebChromeClient(private val activity: AppCompatActivity) : WebChromeClient() {

    var filePathCallbackLollipop: ValueCallback<Array<Uri>>? = null

    // For Android 5.0+
    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    override fun onShowFileChooser(
        webView: WebView?,
        filePathCallback: ValueCallback<Array<Uri>>?,
        fileChooserParams: FileChooserParams
    ): Boolean {
        // Callback 초기화 (중요!)
        if (filePathCallbackLollipop != null) {
            filePathCallbackLollipop?.onReceiveValue(null)
            filePathCallbackLollipop = null
        }
        filePathCallbackLollipop = filePathCallback
        val isCapture = fileChooserParams.isCaptureEnabled
        if (activity is IImageHandler) {
            activity.takePicture(filePathCallbackLollipop)
        }
//        val intent = Intent(Intent.ACTION_GET_CONTENT)
//        intent.addCategory(Intent.CATEGORY_OPENABLE)
//        intent.type = "image/*"
//
//        startActivityForResult(activity, intent, 25, null)
        filePathCallbackLollipop = null

        return true
    }

}