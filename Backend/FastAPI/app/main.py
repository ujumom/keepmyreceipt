from fastapi import FastAPI, File, UploadFile
from starlette.responses import FileResponse
import os.path

from app.tesseract import tesseractOCR
from app.uploadFile import uploadImg

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 접근 허용할 origin 목록
origins = ["*"]

app.add_middleware(
        CORSMiddleware,
        # 등록한 origins들에 대한 접근을 허용
        allow_origins=origins,
        allow_credentials=True,
        # post, get, put, delete 모두 접근 허용
        allow_methods = ["*"],
        # 모든 헤더를 접근 허용
        allow_headers=["*"],
)


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(BASE_DIR, 'images/')

@app.post("/fast/ocr/receipt/photo")
async def analysisReceipt(receipt : UploadFile = File(...)):
    # 이미지 업로드 후 이미지 소스 반환
    receiptSrc = uploadImage(receipt)
    receiptName = receiptSrc['file_name']
    # tesseract로 이미지 소스 전달
    result = tesseractOCR(IMG_DIR + receiptName, "pic")
    result['이미지 url'] = receiptSrc['file']
    return result

@app.post("/fast/ocr/receipt/img")
async def analysisReceipt(receipt : UploadFile = File(...)):
    receiptSrc = uploadImage(receipt)
    receiptName = receiptSrc['file_name']
    result = tesseractOCR(IMG_DIR + receiptName, "img")
    result['이미지 url'] = receiptSrc['file']
    return result

# 이미지 업로드
@app.post("/fast/uploadImage")
def uploadImage(image: UploadFile = File(...)):
    return uploadImg(image)

# 이미지 소스로 조회시 이미지 반환
@app.get('/fast/images/{fileName}')
def getImage(fileName : str):
    return FileResponse(''.join([IMG_DIR, fileName]))