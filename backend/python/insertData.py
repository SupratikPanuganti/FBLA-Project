from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from pymongo import MongoClient, errors
import datetime
from bson.json_util import dumps, loads

app = Flask("insertApp")
api = Api(app)

#database connection
client = MongoClient('localhost',27017)

testdb = client['testdb']
events = testdb['events']
students = testdb['students']

#write try catch

# eventsList = [
#     {"eventId": 1, "eventName": "Football Game", "eventAttendanceId": "Football1234", "eventDate": datetime.datetime(2023, 1, 5), "eventType": "Sporting", "eventDescription": "Denmark vs. Lambert", "eventSlots": 100, "eventRegisteredSlots": 0},
#     {"eventId": 2, "eventName": "Soccer Game", "eventAttendanceId": "Soccer1234", "eventDate": datetime.datetime(2023, 2, 10), "eventType": "Sporting", "eventDescription": "Denmark vs. South Forsyth", "eventSlots": 75, "eventRegisteredSlots": 0},
#     {"eventId": 3, "eventName": "Basketball Game", "eventAttendanceId": "Basketball1234", "eventDate": datetime.datetime(2023, 3, 15), "eventType": "Sporting", "eventDescription": "Denmark vs. West Forsyth", "eventSlots": 50, "eventRegisteredSlots": 0},
#     {"eventId": 4, "eventName": "Track Meet", "eventAttendanceId": "Track1234", "eventDate": datetime.datetime(2023, 4, 20), "eventType": "Sporting", "eventDescription": "Denmark vs. Milton", "eventSlots": 40, "eventRegisteredSlots": 0},
#     {"eventId": 5, "eventName": "Hockey Game", "eventAttendanceId": "Hockey1234", "eventDate": datetime.datetime(2023, 5, 25), "eventType": "Sporting", "eventDescription": "Denmark vs. Central", "eventSlots": 25, "eventRegisteredSlots": 0},
#     {"eventId": 6, "eventName": "FBLA Meeting", "eventAttendanceId": "FBLA1234", "eventDate": datetime.datetime(2023, 6, 3), "eventType": "Non-Sporting", "eventDescription": "Denmark Danes FBLA Club Meeting", "eventSlots": 30, "eventRegisteredSlots": 0},
#     {"eventId": 7, "eventName": "HOSA Meeting", "eventAttendanceId": "HOSA1234", "eventDate": datetime.datetime(2023, 7, 7), "eventType": "Non-Sporting", "eventDescription": "Denmark Danes HOSA Club Meeting", "eventSlots": 20, "eventRegisteredSlots": 0},
#     {"eventId": 8, "eventName": "DECA Meeting", "eventAttendanceId": "DECA1234", "eventDate": datetime.datetime(2023, 8, 16), "eventType": "Non-Sporting", "eventDescription": "Denmark Danes DECA Club Meeting", "eventSlots": 10, "eventRegisteredSlots": 0},
#     {"eventId": 9, "eventName": "Finance Meeting", "eventAttendanceId": "Finance1234", "eventDate": datetime.datetime(2023, 9, 27), "eventType": "Non-Sporting", "eventDescription": "Denmark Danes Finance Club Meeting", "eventSlots": 15, "eventRegisteredSlots": 0},
#     {"eventId": 10, "eventName": "Computer Science Meeting", "eventAttendanceId": "Computer1234", "eventDate": datetime.datetime(2023, 10, 23), "eventType": "Non-Sporting", "eventDescription": "Denmark Danes Computer Science Club Meeting", "eventSlots": 10, "eventRegisteredSlots": 0}
# ]

# studentsList = [
#     { "studentNumber": 1, "studentName": "Bob", "studentGrade": "11", "studentEmail": "bob@gmail.com", "studentPhone": "434-435-6656", "studentAddress": "Cumming, Ga"},
#     { "studentNumber": 2, "studentName": "Jim", "studentGrade": "10", "studentEmail": "jim@gmail.com", "studentPhone": "434-435-6656", "studentAddress": "Cumming, Ga"},
#     { "studentNumber": 3, "studentName": "Henry", "studentGrade": "9", "studentEmail": "henry@gmail.com", "studentPhone": "434-435-6656", "studentAddress": "Alpharetta, Ga"},
#     { "studentNumber": 4, "studentName": "Noah", "studentGrade": "12", "studentEmail": "noah@gmail.com", "studentPhone": "434-435-6656", "studentAddress": "Cumming, Ga"},
#     { "studentNumber": 5, "studentName": "Caleb", "studentGrade": "10", "studentEmail": "caleb@gmail.com", "studentPhone": "434-435-6656", "studentAddress": "Alpharetta, Ga"},
#     { "studentNumber": 6, "studentName": "John", "studentGrade": "9", "studentEmail": "john@gmail.com", "studentPhone": "434-435-6656", "studentAddress": "Cumming, Ga"},
#     { "studentNumber": 7, "studentName": "James", "studentGrade": "11", "studentEmail": "james@gmail.com", "studentPhone": "434-435-6656", "studentAddress": "Alpharetta, Ga"},
#     { "studentNumber": 8, "studentName": "Josh", "studentGrade": "12", "studentEmail": "josh@gmail.com", "studentPhone": "434-435-6656", "studentAddress": "Alpharetta, Ga"},
#     { "studentNumber": 9, "studentName": "Tyler", "studentGrade": "10", "studentEmail": "tyler@gmail.com", "studentPhone": "434-435-6656", "studentAddress": "Alpharetta, Ga"},
#     { "studentNumber": 10, "studentName": "Adam", "studentGrade": "12", "studentEmail": "adam@gmail.com", "studentPhone": "434-435-6656", "studentAddress": "Cumming, Ga"}
# ]

# events.insert_many(eventsList)
# students.insert_many(studentsList)

app.run(debug=True,host="0.0.0.0",port=8080)


