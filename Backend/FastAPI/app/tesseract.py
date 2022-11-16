from imutils.perspective import four_point_transform
import matplotlib.pyplot as plt
import pytesseract
import imutils
import cv2
import re
from datetime import datetime

# 영수증의 윤곽선을 찾고 윤곽선에 맞는 이미지로 변환
def findContour(image):
    ratio = image.shape[0] / 500.0
    org_image = image.copy()
    image = imutils.resize(image, height=500)

    # text를 읽어 오기 위해 이미지 색 보정
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)
    # 윤곽을 잡기 위해 선을 찾아 위치값 추출
    edged = cv2.Canny(gray, 0, 40)

    # 추출한 이미지 윤곽선 중 연결된 사각형 찾기
    cnts = cv2.findContours(edged.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    cnts = sorted(cnts, key=cv2.contourArea, reverse=True)[:5]

    screenCnt = None

    for c in cnts:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)

        if len(approx) == 4:
            screenCnt = approx
            break

    # 영수증 윤곽을 찾지 못할 경우 원본 이미지 반환
    if screenCnt is None:
        return org_image

    # 윤곽을 찾은 경우 찾은 윤곽선을 기준으로 영수증 수정
    cv2.drawContours(image, [screenCnt], -1, (0, 255, 0), 2)
    transform_image = four_point_transform(org_image, screenCnt.reshape(4, 2)*ratio)

    return transform_image

def tesseractOCR(receipt, type):
    image = plt.imread(receipt)
    # 사진 영수증의 경우 윤곽선을 찾기 위해 findContour 함수 실행
    if type == "pic":
        image = findContour(image)
    # psm : 이미지에서 text를 읽는 방식 지정
    # oem : text를 읽기 위한 ocr 엔진 지정
    # lang : 추출할 언어 지정
    configs = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB), config=configs, lang='kor+eng')
    text_list = text.split("\n")
    text_list = list(filter(("").__ne__, text_list))

    totalPrice = ""
    dealDate = ""

    # 날짜와 거래 금액을 가져오기 위한 검색
    for text in text_list:
        if len(totalPrice)>0 and len(dealDate)>0 : break
        replaceText = text.replace(" ","")
        if replaceText.find("받을금액")!=-1:
            replaceText = replaceText[replaceText.find("받을금액")+4:]
            totalPrice = replaceText
        elif replaceText.find("승인금액")!=-1:
            replaceText = replaceText[replaceText.find("승인금액")+4:]
            totalPrice = replaceText
        elif replaceText.find("합계")!=-1:
            replaceText = replaceText[replaceText.find("합계")+2:]
            totalPrice = replaceText
        elif replaceText.find("결제액")!=-1:
            replaceText = replaceText[replaceText.find("결제액")+3:]
            totalPrice = replaceText

        if replaceText.find("일시")!=-1 or replaceText.find("판매일")!=-1 or replaceText.find("2022")!=-1 :
            dealDateList = text.split(" ")
            dealDateList = list(filter(("").__ne__, dealDateList))
            dateFlag = False
            for dealDateItem in dealDateList:
                if dealDateItem[0] >= '0' and dealDateItem[0] <= '9' :
                    if dateFlag == False :
                        dealDateItem = dealDateItem.replace(".", "-")
                        dealDateItem = dealDateItem.replace("/", "-")
                        dealDate += dealDateItem
                        break


    format_data = "%y/%m/%d %H:%M:%S"
    # dealDate = datetime.strptime(dealDate, format_data)

    totalPrice = re.sub(r'[^0-9]', '', totalPrice)
    return {"금액":totalPrice, "거래날짜":dealDate}