#how to start mongodb
#1. Open command prompt
#2. mongod --dbpath "C:/mongodata/db"


from flask import Flask
from pymongo import MongoClient, errors

app = Flask(__name__)
app.config.update(dict(SECRET_KEY='yoursecretkey'))
client = MongoClient('localhost',27017)
DOMAIN = 'localhost:'
PORT = 27017
# use a try-except indentation to catch MongoClient() errors
try:
    # try to instantiate a client instance
    client = MongoClient(
        host = [ str(DOMAIN) + str(PORT) ],
        serverSelectionTimeoutMS = 3000 # 3 second timeout
    )

    # print the version of MongoDB server if connection successful
    print ("server version:", client.server_info()["version"])

except errors.ServerSelectionTimeoutError as err:
    # set the client instance to 'None' if exception
    client = None

    # catch pymongo.errors.ServerSelectionTimeoutError
    print ("pymongo ERROR:", err)