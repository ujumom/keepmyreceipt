package com.ssafy.keep_my_receipt.src.main

import android.Manifest
import android.net.Uri
import android.util.Log
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.messaging.FirebaseMessaging
import com.ssafy.keep_my_receipt.R
import com.ssafy.keep_my_receipt.config.BaseActivity
import com.ssafy.keep_my_receipt.databinding.ActivityMainBinding
import kotlinx.android.synthetic.main.activity_main.*
import com.ssafy.keep_my_receipt.config.ApplicationClass
import android.provider.MediaStore
import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlertDialog
import android.app.DownloadManager
import android.content.*
import android.content.pm.PackageManager
import android.database.Cursor
import android.graphics.Bitmap
import android.os.Build
import android.os.Environment
import android.os.Environment.getExternalStorageDirectory
import android.text.TextUtils
import android.webkit.*
import android.webkit.WebChromeClient.FileChooserParams
import android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
import androidx.core.app.ActivityCompat
import androidx.core.net.toUri
import com.nguyenhoanglam.imagepicker.model.Config
import com.nguyenhoanglam.imagepicker.model.Image
import com.nguyenhoanglam.imagepicker.ui.imagepicker.ImagePicker
import java.io.*
import com.ssafy.keep_my_receipt.src.main.CustomWebChromeClient
import java.net.URLDecoder
import android.webkit.DownloadListener





interface IImageHandler {
    fun takePicture(callBack: ValueCallback<Array<Uri>>?)
    fun uploadImageOnPage(resultCode: Int, intent: Intent?)
}

class MainActivity : BaseActivity<ActivityMainBinding>(R.layout.activity_main), IImageHandler {
    private var alarmed: String? = null
    private lateinit var webView: WebView
    private val CAPTURE_CAMERA_RESULT = 3089
    private var filePathCallbackLollipop: ValueCallback<Array<Uri>>? = null
    private var isStart: Boolean = false

    override fun onStart() {
        super.onStart()
        initStatus()

        setWebView()
        setFCM()
    }

    override fun onBackPressed() {
        if(webView.canGoBack()) {
            //웹사이트에서 뒤로 갈 페이지가 존재한다면,
            webView.goBack() // 웹사이트 뒤로가기
        }else
        {
            super.onBackPressed()
        }
    }

    private fun initStatus() {
        webView = binding.webview
        //bottomNavigationView = binding.bottomNavigationView
    }

    private fun setWebView() {
        webView.settings.javaScriptEnabled = true // 자바스크립트 허용
        webView.webViewClient = WebViewClient() // 웹뷰에서 새 창이 뜨지 않도록 방지하는 구문 1
        webView.webChromeClient = CustomWebChromeClient(this) // 웹뷰에서 새 창이 뜨지 않도록 방지하는 구문 1
//        webView.setDownloadListener(DownloadListener { url, userAgent, contentDisposition, mimetype, contentLength ->
//            Log.e("DOWNLOADURLLLLLLLLLL", url.toString())
//            val downloadManager = this.getSystemService(DOWNLOAD_SERVICE) as DownloadManager
//            val _contentDisposition = URLDecoder.decode(contentDisposition, "UTF-8")
//            val _mimetype = mimetype
//            var fileName = _contentDisposition.replace("attachment; filename=", "")
//            if (!TextUtils.isEmpty(fileName)) {
//                val mimetype = MimeTypeMap.getSingleton().getMimeTypeFromExtension(mimetype)
//                if (fileName.endsWith(";")) {
//                    fileName = fileName.substring(0, fileName.length - 1)
//                }
//            }
//            if (fileName.startsWith("\"") && fileName.endsWith("\"")) {
//                fileName = fileName.substring(1, fileName.length - 1)
//            }
//            var request = DownloadManager.Request(Uri.parse(url)).apply {
//                setMimeType(_mimetype)
//                addRequestHeader("User-Agent", userAgent)
//                setDescription("Downloading File")
//                setAllowedOverMetered(true)
//                setAllowedOverRoaming(true)
//                setTitle(fileName)
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
//                    setRequiresCharging(false)
//                }
//                allowScanningByMediaScanner()
//                setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
//                setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName)
//            }
//            registerDownloadReceiver(downloadManager, this)
//            showToastMessage("다운로드 시작중..")
//        })
        webView.addJavascriptInterface(WebAppInterface(this), "Android")
        Log.e("EEEEEEEEEEEEEE", isStart.toString())
        if (!isStart) {
            Log.e("EEEEEEEEEEEEEE", "태초마을 갑니다.....")
            webView.loadUrl("https://k6d104.p.ssafy.io/")
            isStart = true
        }
    }

    private fun registerDownloadReceiver(downloadManager: DownloadManager, activity: BaseActivity<*>) {
        var downloadReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                var id = intent?.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1) ?: -1
                when (intent?.action) {
                    DownloadManager.ACTION_DOWNLOAD_COMPLETE -> {
                        val query: DownloadManager.Query = DownloadManager.Query()
                        query.setFilterById(id)
                        var cursor = downloadManager.query(query)
                        if (!cursor.moveToFirst()) {
                            return
                        }
                        var columnIndex = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS)
                        var status = cursor.getInt(columnIndex)
                        if (status == DownloadManager.STATUS_SUCCESSFUL) {
                            showToastMessage("다운로드가 완료됐습니다.")
                        }
                        else if (status == DownloadManager.STATUS_FAILED) {
                            showToastMessage("다운로드가 실패했습니다.")
                        }
                    }
                }
            }
        }
        IntentFilter().run {
            addAction(DownloadManager.ACTION_DOWNLOAD_COMPLETE)
            activity.registerReceiver(downloadReceiver, this)
        }
    }


    private fun setFCM() {
        // client FCM token 확인
        FirebaseMessaging.getInstance().token.addOnCompleteListener(OnCompleteListener { task ->
            if (!task.isSuccessful) {
                Log.w("Fetching FCM token fail", task.exception)
                return@OnCompleteListener
            }

            val token = task.result
            ApplicationClass.sSharedPreferences.setToken(token)
            //Log.d("FCM client token", token)
        })

        alarmed = intent.extras.toString()
        if (alarmed != null) {
            //Todo url 파라미터 설정
            //webView.loadUrl("https://k6d104.p.ssafy.io/")
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, intent: Intent?) {
        when(requestCode){
            CAPTURE_CAMERA_RESULT -> {
                onCaptureImageResult(intent)
            }
            Config.RC_PICK_IMAGES -> {
                if (intent != null) {
                    val images: ArrayList<Image> = intent.getParcelableArrayListExtra(Config.EXTRA_IMAGES)!!
                    var data = Intent().apply {
                        data = getImageContentUri(this@MainActivity, images[0].path)
                    }
                    uploadImageOnPage(resultCode, data)
                } else {
                    /**
                     * 만약 사진촬영이나 선택을 하던중 취소할경우 filePathCallbackLollipop 을 null 로 해줘야
                     * 웹에서 사진첨부를 눌렀을때 이벤트를 다시 받을 수 있다.
                     */
                    filePathCallbackLollipop?.onReceiveValue(null)
                    filePathCallbackLollipop = null
                }
            }
        }
        super.onActivityResult(requestCode, resultCode, intent)
    }

    @SuppressLint("Range")
    fun getImageContentUri(context: Context, filePath: String): Uri? {
        val cursor: Cursor? = context.contentResolver.query(
            MediaStore.Images.Media.EXTERNAL_CONTENT_URI, arrayOf(MediaStore.Images.Media._ID),
            MediaStore.Images.Media.DATA + "=? ", arrayOf(filePath), null
        )
        return if (cursor != null && cursor.moveToFirst()) {
            val id: Int = cursor.getInt(cursor.getColumnIndex(MediaStore.MediaColumns._ID))
            cursor.close()
            Uri.withAppendedPath(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "" + id)
        } else {
                val values = ContentValues()
                values.put(MediaStore.Images.Media.DATA, filePath)
                context.contentResolver.insert(
                    MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values
                )
            }
        }

    /**
     * <input type="file"> 태그가 호출되면 IImageHandler를 통해 이 함수가 호출된다.
     */
    override fun takePicture(callBack: ValueCallback<Array<Uri>>?) {
        filePathCallbackLollipop = callBack
        showSelectCameraOrImage()
    }

    override fun uploadImageOnPage(resultCode: Int, intent: Intent?) {
        if (resultCode == Activity.RESULT_OK) {
            if (intent != null) {
                filePathCallbackLollipop?.onReceiveValue(
                    WebChromeClient.FileChooserParams.parseResult(Activity.RESULT_OK, intent)
                )
                filePathCallbackLollipop = null
            }
        } else {
            /**
             * 만약 사진촬영이나 선택을 하던중 취소할경우 filePathCallbackLollipop 을 null 로 해줘야
             * 웹에서 사진첨부를 눌렀을때 이벤트를 다시 받을 수 있다.
             */
            filePathCallbackLollipop?.onReceiveValue(null)
            filePathCallbackLollipop = null
        }
    }

    /**
     * 카메라 / 갤러리 선택 팝업을 표시한다.
     */
    private fun showSelectCameraOrImage() {
        CameraOrImageSelectDialog(object: CameraOrImageSelectDialog.OnClickSelectListener {
            override fun onClickCamera() {
                cameraIntent()
            }

            override fun onClickImage() {
                galleryIntent()
            }
        }).show(supportFragmentManager, "CameraOrImageSelectDialog")
    }

    /**
     * 카메라 작동
     */
    private fun cameraIntent() {
        val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        startActivityForResult(intent, CAPTURE_CAMERA_RESULT)
    }

    /**
     * 이미지 선택
     */
    private fun galleryIntent() {
        ImagePicker.with(this).run {
            setToolbarColor("#FFFFFF")
            setStatusBarColor("#FFFFFF")
            setToolbarTextColor("#000000")
            setToolbarIconColor("#000000")
            setProgressBarColor("#FFC300")
            setBackgroundColor("#FFFFFF")
            setCameraOnly(false)
            setMultipleMode(false)
            setFolderMode(true)
            setShowCamera(false)
            setFolderTitle("file")
            setDoneTitle("file")
            setKeepScreenOn(true)
            start()
        }
    }

    /**
     * 카메라 작동후 전달된 인텐트를 받는다.
     */
    private fun onCaptureImageResult(data: Intent?) {
        if (data == null) {
            /**
             * 만약 사진촬영이나 선택을 하던중 취소할경우 filePathCallbackLollipop 을 null 로 해줘야
             * 웹에서 사진첨부를 눌렀을때 이벤트를 다시 받을 수 있다.
             */
            filePathCallbackLollipop?.onReceiveValue(null)
            filePathCallbackLollipop = null
            return
        }
        val thumbnail = data.extras!!.get("data") as Bitmap
        saveImage(thumbnail)
    }

    /**
     * 비트맵을 로컬에 물리적 이미지 파일로 저장시킨다.
     */
    private fun saveImage(bitmap: Bitmap) {
        val bytes = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, bytes)

        // create a directory if it doesn't already exist
        val photoDirectory = File(getExternalStorageDirectory().absolutePath + "/cameraphoto/")
        if (!photoDirectory.exists()) {
            photoDirectory.mkdirs()
        }
        val imgFile = File(photoDirectory, "${System.currentTimeMillis()}.jpg")
        val fo: FileOutputStream
        try {
            imgFile.createNewFile()
            fo = FileOutputStream(imgFile)
            fo.write(bytes.toByteArray())
            fo.close()
        } catch (e: FileNotFoundException) {
            e.printStackTrace()
        } catch (e: IOException) {
            e.printStackTrace()
        }

        uploadImageOnPage(Activity.RESULT_OK, Intent().apply {
            data = imgFile.toUri()
        })
    }
}