from flask import Flask
from pymongo import MongoClient, errors
from datetime import datetime

app = Flask(__name__)
app.config.update(dict(SECRET_KEY='yoursecretkey'))
client = MongoClient('localhost',27017)

mydatabase = client.list_database_names()
# print(mydatabase)
testdb = client.testdb
# print(testdb)
tables_testdb = testdb.list_collection_names()
# print(tables_testdb)
students = testdb.students
# print(students)
# for i in students.find():
#     print(i)
z = students.find_one({'name': 'ritvik'})
print(z['phone'])
events = testdb.events
# event1 = {"eventName": "FBLA Meeting", "eventType": "Non-sporting", "eventDescription": "Denmark Danes vs. South Forsyth Eagles", "eventSlots": 10, "eventDate": datetime.now()
# }
# r = events.insert_one(event1)
# print("Data inserted with record ids",r)
# y = events.find()
# for i in y:
#     print(i)
# event_list = []
# for i in events.find():
#     event_list.append(i)
# print(event_list[2])