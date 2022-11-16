package com.ssafy.keep_my_receipt.dto

import com.google.firebase.database.Exclude
import com.google.firebase.database.IgnoreExtraProperties
import java.io.Serializable
import java.text.SimpleDateFormat
import java.util.*

@IgnoreExtraProperties
data class User (
    var id:String,
    var password:String,
    var email:String,
    var information : Information,
    var init:Boolean,
    var badge:MutableList<String>?,
    var solved:Long = 0,
    var status:Long = 0,
    var cardSolved:Long = 0
) : Serializable
{
    constructor(map:Map<String, Any>) : this(map["id"] as String, map["password"] as String, map["email"] as String, Information(map["information"] as Map<String, Any>), map["init"] as Boolean, map["badge"] as MutableList<String>?, map["solved"] as Long, map["status"] as Long, map["cardSolved"] as Long)

    @Exclude
    fun toMap() : Map<String, Any?> {
        return mapOf(
            "id" to id,
            "pw" to password,
            "email" to email,
            "information" to information.toMap(),
            "init" to init,
            "badge" to badge,
            "status" to status,
            "solved" to solved,
            "cardSolved" to cardSolved
        )
    }
}

@IgnoreExtraProperties
data class Information (
    var cookies:Long = 0,
    var dateOfRegist:String = SimpleDateFormat("yyyy-MM-dd kk:mm:ss", Locale("ko", "KR")).format(Date(System.currentTimeMillis())).toString(),
    var goodTemp:Long = 0,
    var maxChatroom:Long = 1,
    var nickNameFirst:String = "",
    var nickNameLast:String = "",
    var profileImg:String = ""
) : Serializable
{
    constructor(map: Map<String, Any>) : this(map["cookies"] as Long,
        map["dateOfRegist"] as String,
        map["goodTemp"] as Long,
        map["maxChatroom"] as Long ,
        map["nickNameFirst"] as String,
        map["nickNameLast"] as String,
        map["profileImg"] as String)

    @Exclude
    fun toMap() : Map<String, Any?> {
        return mapOf(
            "cookies" to cookies,
            "dateOfRegist" to dateOfRegist,
            "goodTemp" to goodTemp,
            "maxChatroom" to maxChatroom,
            "nickNameFirst" to nickNameFirst,
            "nickNameLast" to nickNameLast,
            "profileImg" to profileImg
        )
    }
}