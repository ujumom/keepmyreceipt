package com.ssafy.keep_my_receipt.src.main

import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.WebView
import android.widget.Button
import android.widget.ImageView
import androidx.fragment.app.DialogFragment
import com.ssafy.keep_my_receipt.R

class CameraOrImageSelectDialog(private val listener: OnClickSelectListener) : DialogFragment() {
    private lateinit var llSelectCamera: ImageView
    private lateinit var llSelectImage : ImageView

    interface OnClickSelectListener {
        fun onClickCamera()
        fun onClickImage()
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle? ): View? {
        val view = inflater.inflate(R.layout.dialog_camera_image_select, container, false)
        llSelectCamera = view.findViewById(R.id.llSelectCamera)
        llSelectImage = view.findViewById(R.id.llSelectImage)
        return view
    }

    override fun onStart() {
        super.onStart()
        if (dialog != null) {
            val width = ViewGroup.LayoutParams.MATCH_PARENT
            val height = ViewGroup.LayoutParams.WRAP_CONTENT
            dialog!!.window!!.setLayout(width, height)
            dialog!!.window!!.setGravity(Gravity.BOTTOM)
            dialog!!.window!!.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
            dialog!!.setCancelable(false)
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        llSelectCamera.setOnClickListener {
            listener.onClickCamera()
            dismiss()
        }
        llSelectImage.setOnClickListener {
            listener.onClickImage()
            dismiss()
        }
    }
}
