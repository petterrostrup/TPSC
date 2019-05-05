import pymongo

myclient = pymongo.MongoClient("mongodb://172.16.0.1:27017/")
mydb = myclient["mydatabase"]
mycol = mydb["temperature"]

mydict = { "name": "John", "address": "Highway 37" }

x = mycol.insert_one(mydict)

print(myclient.list_database_names())