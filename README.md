# Tradie Job Tracker API

A Tradie Job Tracker API created with NodeJS and MongoDB.

## Table of contents
* [General info](#general-info)
* [Features](#features)
* [How to use](#How-to-use)

## General info
This application allows for a tradie to add and edit/track the progress of their jobs. 

## Features
Each job has the following information associated with it:
* Unique Job ID
* Status: Scheduled, Active, Invoicing, To priced, Completed
* Creation Date and Time
* Client Information: Name, Mobile Number and/or Email
* Additional Notes

For each job a tradie can:
* Filter and sort the list of jobs.
* Get all the details of a job.
* Add/edit notes for a job.
* Change the status of a job.

## <a name="How-to-use">How to use</a>
Access this API using tradiejobtracker-xszpmei5dq-ts.a.run.app (address)
#### Note
All dates and time returned are in UTC. However, when filtering/sorting you may enter dates as if it were NZST as conversions will be handled automatically.

### Sign Up
* Path: address/api/user/signup
* Request Type: POST
* Password Requirements: Minimum length of 8 with at least 1 number and 1 letter
* Attach JSON in the body of the request as follows
```
{
    "email": "youremail",
    "password": "yourpassword"
}
```
* Returns Email and Token (Access Token) in JSON

### Login
* Path: address/api/user/login
* Request Type: POST
* Attach JSON in the body of the request as follows
```
{
    "email": "youremail",
    "password": "yourpassword"
}
```
* Returns Email and Token (Access Token) in JSON

### Get all Jobs
* Path: address/api/jobs
* Request Type: GET
* Attach Bearer Access Token ("Bearer accessToken") as Authorization header
* Returns details about all jobs associated with your account in JSON

### Get Jobs with Filter
* Path: address/api/jobs?
* Request Type: GET
* Attach Bearer Access Token (Bearer accessToken) as Authorization header
* Add filter conditions after ? in path
* Possible conditions
```
Date range: date=gte:yyyy-MM-dd&date=lte:yyyy-MM-dd ---------- gte (Greater than or equal to), lte (Less than or equal to)
Specific date: date=eq:yyyy-MM-dd
Client name: name=clientName
Client email: email=clientEmail
Client mobile: mobile=clientMobile
Job status: status=jobStatus
```
* Multiple filters can be combined together by using &
* Multiple values can be combined together by using |
#### Example
```
address/api/jobs?date=gte:yyyy-MM-dd&date=lte:yyyy-MM-dd&status=jobStatus1|jobStatus2
```
* Returns details about all jobs that meet the filters and is associated with your account in JSON

### Get Jobs with Sorting
* Path: address/api/jobs?sort_by=fieldName&order_by=order
* Request Type: GET
* Attach Bearer Access Token (Bearer accessToken) as Authorization header
* Add sorting conditions after ? in path
* Sorting conditions
```
Date: date
Client name: name
Client email: email
Client mobile: mobile
Job status: status

Order: asc or desc
```
#### Example
```
address/api/jobs?sort_by=mobile&order_by=asc
```
* Returns details about all jobs in sorted order that is associated with your account in JSON

### Get Jobs with Sorting and Filter
* Path: address/api/jobs?
* Request Type: GET
* Attach Bearer Access Token (Bearer accessToken) as Authorization header
* Add sorting and filtering conditions after ? in path, seperate conditions using &
#### Example
```
address/api/jobs?sort_by=mobile&order_by=asc&date=gte:yyyy-MM-dd&date=lte:yyyy-MM-dd&status=jobStatus1|jobStatus2
```
* Returns details about all filtered jobs in sorted order that is associated with your account in JSON

### Get a Job
* Path: address/api/jobs/_id
* Request Type: GET
* Replace _id with the value of _id for the associated job
* Attach Bearer Access Token (Bearer accessToken) as Authorization header
* Returns details about the specified job in JSON
#### Example
```
{
    "client": {
        "name": "clientName",
        "email": "clientEmail",
        "mobile": "clientMobile"
    },
    "_id": "6312a12efd7dcb3272a1c2f1",
    "date": "2022-09-03T00:30:00.734Z",
    "status": "Active",
    "notes": [
        "Note1",
        "Note2"
    ],
    "user_id": "6312a0b3fd7dcb3272a1c2e2",
    "__v": 0
}
```

### Change Status and/or Notes
* Path: address/api/jobs/_id
* Request Type: PATCH
* Replace _id with the value of _id for the associated job
* Attach Bearer Access Token (Bearer accessToken) as Authorization header
* Attach JSON in the body of the request as follows
```
{
    "status": "statusOfJob",
    "notes": ["note1", "note2", "note3"...]
}
```
* Notes array must contain ALL notes you would like, including old unchanged notes
* Returns details of updated job in JSON

### Delete a job
* Path: address/api/jobs/_id
* Request Type: DELETE
* Replace _id with the value of _id for the associated job
* Attach Bearer Access Token (Bearer accessToken) as Authorization header
* Returns details about the specified job in JSON
