from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from pymongo import MongoClient, errors
from datetime import datetime
from bson.json_util import dumps, loads
import uuid
import random
from operator import attrgetter
import datetime as dt
import pandas as pd
from flask_cors import CORS

#flask
app = Flask("VideoAPI")
api = Api(app)
# app.config.update(dict(SECRET_KEY='yoursecretkey'))

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

#database connection
client = MongoClient('localhost',27017)

#database pathways
testdb = client['testdb']
events = testdb['events']
students = testdb['students']
studentevent = testdb['studentevent']
winners = testdb['winners']

#Event lists
@app.route('/api/events')
def getEvents():
    events_list = []
    for i in events.find({}, {"_id": 0 }):
        events_list.append(i)
    x = jsonify(events_list)
    x.headers.add("Access-Control-Allow-Origin", "*")
    return x

#Student information
@app.route('/api/students')
def getStudents():
    students_list = []
    for i in students.find({}, {"_id": 0 }):
        students_list.append(i)
    z = jsonify(students_list)
    z.headers.add("Access-Control-Allow-Origin", "*")
    return z

# Input Student Id on home screen and assign it to a global variable
@app.route('/api/student', methods=['GET'])
def searchStudent():
    args = request.args
    studentNumber = int(args.get('studentNumber'))
    x =  students.find_one({"studentNumber": studentNumber})
    if x is not None:
        y = jsonify(studentNumber=x['studentNumber'], studentGrade=x['studentGrade'], studentName=x['studentName'], studentEmail=x['studentEmail'], message="successfully found student")
        y.headers.add("Access-Control-Allow-Origin", "*")
        return y
    else:
        z = jsonify(message="student not found, please register")
        z.headers.add("Access-Control-Allow-Origin", "*")
        return z

# Post 
@app.route('/api/student/login', methods=['POST'])
def studentLogin():
    studentEmail = request.json['email']
    studentPassword = request.json['password']
    x =  students.find_one({"studentEmail": studentEmail, "studentPassword": studentPassword})
    if x is not None:
        y = jsonify(studentNumber=x['studentNumber'], studentGrade=x['studentGrade'], studentName=x['studentName'], studentEmail=x['studentEmail'], message="successfully found student")
        y.headers.add("Access-Control-Allow-Origin", "*")
        return y
    else:
        z = jsonify(message="student not found, please register")
        z.headers.add("Access-Control-Allow-Origin", "*")
        return z
    
#Event registration
@app.route('/api/event-registration', methods=['POST'])
def eventReg():
    # make studentId the inserted value
    studentNumber = request.json['studentNumber']
    studentName = request.json['studentName']
    studentGrade = request.json['studentGrade']
    eventId = request.json['eventId']
    eventName = request.json['eventName']
    eventDate = datetime.strptime(request.json['eventDate'], '%m/%d/%Y')
    eventAttendance = request.json['eventAttendance']
    registrationConfirmationId = str(uuid.uuid1())
    try:
        q = studentevent.insert_one({"studentNumber": studentNumber, "studentName": studentName, "studentGrade": studentGrade,
        "eventId": eventId, "eventName": eventName, "eventDate": eventDate, "eventAttendance": eventAttendance, 
        "registrationConfirmationId": registrationConfirmationId, "quarter": "0"})
    except:
        z = jsonify(message = "Already registered for this event")
        z.headers.add("Access-Control-Allow-Origin", "*")
        return z
    if(q is not None):
        y = jsonify(registrationConfirmationId=registrationConfirmationId, message=f"successfully registered {studentName}")
        y.headers.add("Access-Control-Allow-Origin", "*")
        return y
    else:
        z = jsonify(message = "could not register")
        z.headers.add("Access-Control-Allow-Origin", "*")
        return z

#Event Attendance
@app.route('/api/event-attendance', methods=['POST'])
def eventAttendance():
    registrationConfirmationId = request.json['registrationConfirmationId']
    eventAttendanceId = request.json['eventAttendanceId']
    studentNumber = int(request.json['studentNumber'])
    currentDay = datetime.now().day
    currentMonth = datetime.now().month
    currentYear = datetime.now().year
    quarter = str(pd.Timestamp(dt.date(currentYear, currentMonth, currentDay)).quarter)
    t = studentevent.find_one({"registrationConfirmationId":{"$exists":True, "$in": [registrationConfirmationId]}})
    if (t is not None):
        x = t['eventId']
        f = events.find_one({"eventId":{"$exists":True, "$in": [x]}, "eventAttendanceId":{"$exists":True, "$in": [eventAttendanceId]}})
        if (f is not None):
            newvalues = { "$set": { "eventAttendance": True, "quarter":quarter }}
            filter = { 'eventId': x, 'studentNumber': studentNumber}
            u = studentevent.update_one(filter, newvalues)
            if (u is not None and u.acknowledged):
                y = jsonify(message = "Successfully participated in event and you have been awarded one point")
                y.headers.add("Access-Control-Allow-Origin", "*")
                return y
            else:
                # write a try catch
                z = jsonify(message = "system error")
                z.headers.add("Access-Control-Allow-Origin", "*")
                return z
        else:
            x = jsonify(message = "Attendance Id incorrect")
            x.headers.add("Access-Control-Allow-Origin", "*")
            return x
    else:
        q = jsonify(message = "Confirmation Id not found")
        q.headers.add("Access-Control-Allow-Origin", "*")
        return q

# Student Performance
@app.route('/api/student-performance', methods=['GET'])
def studentPerformance():
    args = request.args
    studentNumber = int(args.get('studentNumber'))
    x =  studentevent.find_one({"studentNumber": studentNumber})
    if x is not None:
        cursor = studentevent.aggregate([
            { "$match": {"studentNumber": studentNumber, "eventAttendance": True}},
            { "$group" : {"_id":"$studentNumber", "student_points": {"$sum":1}} },
            {"$limit": 1}
        ])
        d = []
        for doc in cursor:
            d.append(doc)
        y = jsonify(studentName=x['studentName'], studentGrade=x['studentGrade'], points=d[0]['student_points'])
        y.headers.add("Access-Control-Allow-Origin", "*")
        return y
    else:
        z = jsonify(message="student not found, please register")
        z.headers.add("Access-Control-Allow-Origin", "*")
        return z

# Winners
@app.route('/api/winners', methods=['GET'])
def winnersList():
    args = request.args
    quarter = args.get('quarter')
    cursor = studentevent.aggregate([
        { "$match": {"eventAttendance": True, "quarter": quarter}},
        {"$group": {
            "_id": "$studentNumber",
            "studentPoints": { "$sum": 1 },
            "studentName": { "$first": "$studentName" },
            "studentGrade": { "$first": "$studentGrade" },
            "quarter": { "$first": "$quarter"},
        }},
        {"$project": {
            "_id": 0,  # exclude _id field
            "studentNumber": "$_id",
            "studentPoints": 1,
            "studentName": 1,
            "studentGrade": 1,
            "quarter": 1,
        }}
    ])
    d = []
    result9 = []
    result10 = []
    result11 = []
    result12 = []
    for doc in cursor:
        d.append(doc)
    print(f"d{d}")
    if len(d) == 0:
        y = jsonify(d)
        y.headers.add("Access-Control-Allow-Origin", "*")
        return y
    for i in d:
        if i['studentGrade'] == "9":
            result9.append(i)
        elif i['studentGrade'] == "10":
            result10.append(i)
        elif i['studentGrade'] == "11":
            result11.append(i)
        elif i['studentGrade'] == "12":
            result12.append(i)
    grade9Highest = {}
    grade9Random = {}
    if len(result9) > 0:
        grade9Highest = max(result9, key=lambda x:x['studentPoints'])
        grade9Highest["winnerType"] = "Highest"
        grade9Highest["reward"] = "$25 School Store Gift Card"
        result9.remove(grade9Highest)
        if len(result9) > 0:
            grade9Random = random.choice(result9)
            grade9Random["winnerType"] = "Random"
            if grade9Random["studentPoints"] > 4:
                grade9Random["reward"] = "School Spirit T-Shirt"
            else:
                grade9Random["reward"] = "Ice Cream"
    grade10Highest = {}
    grade10Random = {}
    if len(result10) > 0:
        grade10Highest = max(result10, key=lambda x:x['studentPoints'])
        grade10Highest["winnerType"] = "Highest"
        grade10Highest["reward"] = "$25 School Store Gift Card"
        result10.remove(grade10Highest)
        if len(result10) > 0:
            grade10Random = random.choice(result10)
            grade10Random["winnerType"] = "Random"
            if grade10Random["studentPoints"] > 4:
                grade10Random["reward"] = "School Spirit T-Shirt"
            else:
                grade10Random["reward"] = "Ice Cream"
    grade11Highest = {}
    grade11Random = {}
    print(f"result11{result11}")
    if len(result11) > 0:
        grade11Highest = max(result11, key=lambda x:x['studentPoints'])
        grade11Highest["winnerType"] = "Highest"
        grade11Highest["reward"] = "$25 School Store Gift Card"
        print(f"grade11Highest{grade11Highest}")
        result11.remove(grade11Highest)
        if len(result11) > 0:
            grade11Random = random.choice(result11)
            grade11Random["winnerType"] = "Random"
            print(f"grade11Random{grade11Random}")
            if grade11Random["studentPoints"] > 4:
                grade11Random["reward"] = "School Spirit T-Shirt"
            else: 
                grade11Random["reward"] = "Ice Cream"
    grade12Highest = {}
    grade12Random = {}        
    if len(result12) > 0:
        grade12Highest = max(result12, key=lambda x:x['studentPoints'])
        grade12Highest["winnerType"] = "Highest"
        grade12Highest["reward"] = "$25 School Store Gift Card"
        result12.remove(grade12Highest)
        if len(result12) > 0:
            grade12Random = random.choice(result12)
            grade12Random["winnerType"] = "Random"
            if grade12Random["studentPoints"] > 4:
                grade12Random["reward"] = "School Spirit T-Shirt"
            else:
                grade12Random["reward"] = "Ice Cream"
    e = winners.find_one({"winnerType": "Highest", "quarter": quarter})
    print(f"e{e}")
    if e is not None:
        winning_list = []
        for i in winners.find({"quarter": quarter}, {"_id": 0}):
            winning_list.append(i)
        print(f"winninglist{winning_list}")
        z = jsonify(winning_list)
        z.headers.add("Access-Control-Allow-Origin", "*")
        return z
    else:
        print("correct")
        winnerz1 = [grade9Highest, grade9Random, grade10Highest, grade10Random, grade11Highest, grade11Random, grade12Highest, grade12Random]
        winnerz2 = []
        for i in winnerz1:
            if bool(i):
                winnerz2.append(i)
        print(f'Winnerz2 {winnerz2}')
        w = winners.insert_many(winnerz2)
        if(w is not None):
            k = winners.find({"quarter": quarter}, {"_id": 0})
        allWinners = []
        for i in k:
            allWinners.append(i)
        y = jsonify(allWinners)
        y.headers.add("Access-Control-Allow-Origin", "*")
        return y

    

app.run(debug=True,host="0.0.0.0",port=8080)

