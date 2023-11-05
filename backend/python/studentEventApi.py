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
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

#database connection
client = MongoClient('localhost',27017)

#database pathways
testdb = client['testdb']
events = testdb['events']
students = testdb['students']
studentevent = testdb['studentevent']
winners = testdb['winners']

# Student Login
@app.route('/api/student/login', methods=['POST'])
def studentLogin():
    # student inputs email and password
    studentEmail = request.json['email']
    studentPassword = request.json['password']
    # find the inputted email and password in the database
    studentExists =  students.find_one({"studentEmail": studentEmail, "studentPassword": studentPassword})
    # if login credentials found alert them 
    if studentExists is not None:
        studentFoundMessage = jsonify(studentNumber=studentExists['studentNumber'], studentGrade=studentExists['studentGrade'], studentName=studentExists['studentName'], studentEmail=studentExists['studentEmail'], message="successfully found student")
        studentFoundMessage.headers.add("Access-Control-Allow-Origin", "*")
        return studentFoundMessage
    # if login credentials not found alert them
    else:
        studentNotFoundMessage = jsonify(message="student not found, please register")
        studentNotFoundMessage.headers.add("Access-Control-Allow-Origin", "*")
        return studentNotFoundMessage
    
# Events list
@app.route('/api/events')
def getEvents():
    events_list = []
    # loop through all of the events in the event list and add it to a list
    for i in events.find({}, {"_id": 0 }):
        events_list.append(i)
    # display the events
    eventsDisplay = jsonify(events_list)
    eventsDisplay.headers.add("Access-Control-Allow-Origin", "*")
    return eventsDisplay
    
#Event registration
@app.route('/api/event-registration', methods=['POST'])
def eventReg():
    # server gathers student and event information about the registration which was acquired when the student logged in
    studentNumber = request.json['studentNumber']
    studentName = request.json['studentName']
    studentGrade = request.json['studentGrade']
    eventId = request.json['eventId']
    eventName = request.json['eventName']
    eventDate = datetime.strptime(request.json['eventDate'], '%m/%d/%Y')
    eventAttendance = request.json['eventAttendance']
    registrationConfirmationId = str(uuid.uuid1())
    # inserting student and event registration details into database
    try:
        studentRegistrationInsertion = studentevent.insert_one({"studentNumber": studentNumber, "studentName": studentName, "studentGrade": studentGrade,
        "eventId": eventId, "eventName": eventName, "eventDate": eventDate, "eventAttendance": eventAttendance, 
        "registrationConfirmationId": registrationConfirmationId, "quarter": "0"})
    # notify the student if they are already registered
    except:
        alreadyRegisteredMessage = jsonify(message = "Already registered for this event")
        alreadyRegisteredMessage.headers.add("Access-Control-Allow-Origin", "*")
        return alreadyRegisteredMessage
    # notify the student if the data was inserted into the database
    if(studentRegistrationInsertion is not None):
        successfulRegistrationMessage = jsonify(registrationConfirmationId=registrationConfirmationId, message=f"successfully registered {studentName}")
        successfulRegistrationMessage.headers.add("Access-Control-Allow-Origin", "*")
        return successfulRegistrationMessage
    # notify the student if the registration was unseccesful for another reason besides already being registered
    else:
        registrationErrorMessage = jsonify(message = "could not register")
        registrationErrorMessage.headers.add("Access-Control-Allow-Origin", "*")
        return registrationErrorMessage

#Event Attendance
@app.route('/api/event-attendance', methods=['POST'])
def eventAttendance():
    # server gathers information about the registration and the date/quarter
    registrationConfirmationId = request.json['registrationConfirmationId']
    eventAttendanceId = request.json['eventAttendanceId']
    studentNumber = int(request.json['studentNumber'])
    currentDay = datetime.now().day
    currentMonth = datetime.now().month
    currentYear = datetime.now().year
    quarter = str(pd.Timestamp(dt.date(currentYear, currentMonth, currentDay)).quarter)
    # check if the confirmation id exists
    confirmationIdExists = studentevent.find_one({"registrationConfirmationId":{"$exists":True, "$in": [registrationConfirmationId]}})
    # check if confirmation id is correct 
    if (confirmationIdExists is not None):
        eventId = confirmationIdExists['eventId']
        findEvents = events.find_one({"eventId":{"$exists":True, "$in": [eventId]}, "eventAttendanceId":{"$exists":True, "$in": [eventAttendanceId]}})
        # check if attendance id is correct 
        # if everything matches up change attendance to true and award a point
        if (findEvents is not None):
            newvalues = { "$set": { "eventAttendance": True, "quarter":quarter }}
            filter = { 'eventId': eventId, 'studentNumber': studentNumber}
            updateStudenteventTable = studentevent.update_one(filter, newvalues)
            # alert student of successful participation
            if (updateStudenteventTable is not None and updateStudenteventTable.acknowledged):
                successfulRegistrationMessage = jsonify(message = "Successfully participated in event and you have been awarded one point")
                successfulRegistrationMessage.headers.add("Access-Control-Allow-Origin", "*")
                return successfulRegistrationMessage
            # alert student of any error
            else:
                systemErrorMessage = jsonify(message = "system error")
                systemErrorMessage.headers.add("Access-Control-Allow-Origin", "*")
                return systemErrorMessage
        # alert student if attendance id not correct
        else:
            attendanceIdErrorMessage = jsonify(message = "Attendance Id incorrect")
            attendanceIdErrorMessage.headers.add("Access-Control-Allow-Origin", "*")
            return attendanceIdErrorMessage
    # alert student if confirmation id not correct
    else:
        confirmationIdErrorMessage = jsonify(message = "Confirmation Id not found")
        confirmationIdErrorMessage.headers.add("Access-Control-Allow-Origin", "*")
        return confirmationIdErrorMessage

# Student Performance
@app.route('/api/student-performance', methods=['GET'])
def studentPerformance():
    # server gathers information about the student which was acquired when the student logged in
    args = request.args
    studentNumber = int(args.get('studentNumber'))
    # see if student exists in database
    findStudent =  studentevent.find_one({"studentNumber": studentNumber})
    # if student exists add all of their participated events to give them their total points
    if findStudent is not None:
        cursor = studentevent.aggregate([
            { "$match": {"studentNumber": studentNumber, "eventAttendance": True}},
            { "$group" : {"_id":"$studentNumber", "student_points": {"$sum":1}} },
            {"$limit": 1}
        ])
        d = []
        for doc in cursor:
            d.append(doc)
        studentInfoMessage = jsonify(studentName=findStudent['studentName'], studentGrade=findStudent['studentGrade'], points=d[0]['student_points'])
        studentInfoMessage.headers.add("Access-Control-Allow-Origin", "*")
        return studentInfoMessage
    # if student not found alert the student
    else:
        studentNotFoundMessage = jsonify(message="student not found, please register")
        studentNotFoundMessage.headers.add("Access-Control-Allow-Origin", "*")
        return studentNotFoundMessage

# Winners
@app.route('/api/winners', methods=['GET'])
def winnersList():
    # server gathers information about the student which was acquired when the student logged in
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
    # add all records to give each student a point total
    for doc in cursor:
        d.append(doc)
    if len(d) == 0:
        noWinnersMessage = jsonify(d)
        noWinnersMessage.headers.add("Access-Control-Allow-Origin", "*")
        return noWinnersMessage
    # add each grades students to a separate list
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
    # calculate highest winner for grade 9 and assign a certain reward
    if len(result9) > 0:
        grade9Highest = max(result9, key=lambda x:x['studentPoints'])
        grade9Highest["winnerType"] = "Highest"
        grade9Highest["reward"] = "$25 School Store Gift Card"
        result9.remove(grade9Highest)
        # calculate random winner for grade 9 and assign a reward based on their points
        if len(result9) > 0:
            grade9Random = random.choice(result9)
            grade9Random["winnerType"] = "Random"
            if grade9Random["studentPoints"] > 4:
                grade9Random["reward"] = "School Spirit T-Shirt"
            else:
                grade9Random["reward"] = "Ice Cream"
    grade10Highest = {}
    grade10Random = {}
    # calculate highest winner for grade 10 and assign a certain reward
    if len(result10) > 0:
        grade10Highest = max(result10, key=lambda x:x['studentPoints'])
        grade10Highest["winnerType"] = "Highest"
        grade10Highest["reward"] = "$25 School Store Gift Card"
        result10.remove(grade10Highest)
        # calculate random winner for grade 10 and assign a reward based on their points
        if len(result10) > 0:
            grade10Random = random.choice(result10)
            grade10Random["winnerType"] = "Random"
            if grade10Random["studentPoints"] > 4:
                grade10Random["reward"] = "School Spirit T-Shirt"
            else:
                grade10Random["reward"] = "Ice Cream"
    grade11Highest = {}
    grade11Random = {}
    # calculate highest winner for grade 11 and assign a certain reward
    if len(result11) > 0:
        grade11Highest = max(result11, key=lambda x:x['studentPoints'])
        grade11Highest["winnerType"] = "Highest"
        grade11Highest["reward"] = "$25 School Store Gift Card"
        result11.remove(grade11Highest)
        # calculate random winner for grade 11 and assign a reward based on their points
        if len(result11) > 0:
            grade11Random = random.choice(result11)
            grade11Random["winnerType"] = "Random"
            if grade11Random["studentPoints"] > 4:
                grade11Random["reward"] = "School Spirit T-Shirt"
            else: 
                grade11Random["reward"] = "Ice Cream"
    grade12Highest = {}
    grade12Random = {}   
    # calculate highest winner for grade 11 and assign a certain reward     
    if len(result12) > 0:
        grade12Highest = max(result12, key=lambda x:x['studentPoints'])
        grade12Highest["winnerType"] = "Highest"
        grade12Highest["reward"] = "$25 School Store Gift Card"
        result12.remove(grade12Highest)
        # calculate random winner for grade 12 and assign a reward based on their points
        if len(result12) > 0:
            grade12Random = random.choice(result12)
            grade12Random["winnerType"] = "Random"
            if grade12Random["studentPoints"] > 4:
                grade12Random["reward"] = "School Spirit T-Shirt"
            else:
                grade12Random["reward"] = "Ice Cream"
    # check if winners for that quarter have already been calculated
    e = winners.find_one({"winnerType": "Highest", "quarter": quarter})
    # if winners already exist display them
    if e is not None:
        winning_list = []
        for i in winners.find({"quarter": quarter}, {"_id": 0}):
            winning_list.append(i)
        winnersMessage = jsonify(winning_list)
        winnersMessage.headers.add("Access-Control-Allow-Origin", "*")
        return winnersMessage
    # if winners don't exist insert them into the database and display them
    else:
        winnerz1 = [grade9Highest, grade9Random, grade10Highest, grade10Random, grade11Highest, grade11Random, grade12Highest, grade12Random]
        winnerz2 = []
        for i in winnerz1:
            if bool(i):
                winnerz2.append(i)
        insertWinners = winners.insert_many(winnerz2)
        if(insertWinners is not None):
            findWinners = winners.find({"quarter": quarter}, {"_id": 0})
        allWinners = []
        for i in findWinners:
            allWinners.append(i)
        y = jsonify(allWinners)
        y.headers.add("Access-Control-Allow-Origin", "*")
        return y

    
app.run(debug=True,host="0.0.0.0",port=8080)

