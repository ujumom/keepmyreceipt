import datetime
import os.path
import secrets

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(BASE_DIR, 'images/')
SERVER_IMG_DIR = os.path.join('https://localhost/fast', 'images/')

def uploadImg(image):
    # 이미지 업로드시 이름 중복 방지를 위해 업로드 시간과 16진수값으로 이름 지정
    currentTime = datetime.datetime.now().strftime("%Y%m%d&H%M%S")
    saved_file_name = ''.join([currentTime,secrets.token_hex(16),".jpg"])
    file_location = os.path.join(IMG_DIR,saved_file_name)
    with open(file_location, "wb+") as fp :
        fp.write(image.file.read())
    return {'file' : SERVER_IMG_DIR+saved_file_name, 'file_name' : saved_file_name}