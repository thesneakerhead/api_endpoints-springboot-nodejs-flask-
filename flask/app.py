from flask import Flask, request
from flask_cors import CORS
import torch
from models.experimental import attempt_load
import numpy as np
import os
from PIL import Image
import base64

app = Flask(__name__)
CORS(app)
best_pt = './runs/train/yolov5s_results/weights/best.pt'
model = None
pictureCount = 0


def infer(model, img):
    # img = './test/10.jpg'
    filename = img.split('/')[-1].split('.')[0]
    # Do not touch the categories
    category = ['1', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '2', '20', '21', '22', '23', '24',
                '25', '26', '27', '28', '29', '3', '30', '31', '4', '5', '6', '7', '8', '9']
    category_map = {
        1: "Up Arrow",
        2: "Down Arrow",
        3: "Right Arrow",
        4: "Left Arrow",
        5: "Stop",
        6: "1",
        7: "2",
        8: "3",
        9: "4",
        10: '5',
        11: '6',
        12: '7',
        13: '8',
        14: '9',
        15: 'A',
        16: "B",
        17: "C",
        18: "D",
        19: "E",
        20: "F",
        21: 'G',
        22: 'H',
        23: 'S',
        24: 'T',
        25: 'U',
        26: 'V',
        27: 'W',
        28: 'X',
        29: 'Y',
        30: 'Z',
        31: 'Bulls Eye'
    }

    # Load the saved weights
    # To save time in the actual run, we can load a model outside the function so that weights do not have to be reinstantiated.
    img = Image.open(img)
    output = model(img).pred
    output = int(output[0][0][-1])
    # return categorical result
    output = category_map[int(category[output])]
    print(output)
    # print(category_map[output])
    return output


@app.before_first_request
def initModel():
    global model
    model = torch.hub.load('ultralytics/yolov5', 'custom', path=best_pt)


@app.route('/')
def hello():
    return infer(model)


@app.route('/classify', methods=['GET', 'POST'])
def classifyImage():
    global pictureCount
    jsonrequest = request.json
    img = jsonrequest['image']
    imgdata = base64.b64decode(img)
    filename = 'picture' + str(pictureCount) + '.jpg'
    pictureCount += 1
    with open(filename, 'wb+') as f:
        f.write(imgdata)
    imagepath = './' + filename
    return infer(model, imagepath)


if __name__ == "__main__":
    app.run(host='0.0.0.0')
