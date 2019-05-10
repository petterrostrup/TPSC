import random
import time
import datetime
import json
import urllib.request

myurl = "http://127.0.0.1:49160/api/temp"

tempBot = 16
tempTop = 22

percentile = 0.10
direction = 0
timeToFlip = 150
timeToSend = 300

temp = 20
flipTime = 0
sendTime = 0
tempList = []

def myconverter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()

while True:
    percentCheck = random.random()
    flipTime += 1
    sendTime += 1

    if percentCheck < percentile:
        newTemp = temp + (0.1*direction)

        if (newTemp < tempTop) and (newTemp > tempBot):
            temp = round(newTemp, 2)

    if flipTime == timeToFlip:
        somePercent = random.random()
        if somePercent < 0.33:
            direction = -1
        elif (somePercent > 0.33) and (somePercent < 0.66):
            direction = 0
        else:
            direction = 1

        flipTime =  0
    
    newObject = {
        "sensor": "temp-room-1",
        "time": datetime.datetime.now(),
        "temp": temp
    }
    tempList.append(newObject)

    if sendTime == timeToSend:
        req = urllib.request.Request(myurl)
        req.add_header('Content-Type', 'application/json; charset=utf-8')
        jsondata = json.dumps(tempList, default = myconverter)
        jsondataasbytes = jsondata.encode('utf-8')   # needs to be bytes
        req.add_header('Content-Length', len(jsondataasbytes))
        print (jsondataasbytes)
        response = urllib.request.urlopen(req, jsondataasbytes)
        sendTime = 0
        tempList = []

    print("This is the temp in Celsius:" + str(temp))
    time.sleep(1)
    