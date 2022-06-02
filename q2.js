const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://kits_username:kits_password@cluster0.9nck6.mongodb.net/sms_db?retryWrites=true&w=majority");

// To connect to locally stored DBMS.
// mongoose.console("mongodb://localhost/sms_db");

const db_instance = mongoose.connection;

db_instance.on('error', () => { console.log("DB Connection failed"); });
db_instance.on('open', () => { console.log("DB Connection Successful"); });

const app = express();
const port = 8080; //443 if we want to use https

app.use(cors({
    'origin': "http://localhost:3000"
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


const studentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNumber: String,
    email: String,
    dateOfBirth: String,
    gender: String,
    address: String,
    fatherName: String,
    motherName: String,
    guardianName: String,
    guardianPhoneNumber: String,
    classXMark: String,
    classXIIMark: String,
    classXIISchool: String,
    interests: Array,
});

const student = mongoose.model('students', studentSchema);

app.listen(process.env.PORT || port, () => {
    console.log("Server started...");
});

app.get("/status", (req, res) => {
    res.json({
        'status': "Active"
    });
});

app.get('/students', (req, res) => {
    const students = student.find({});
    students.exec((error, data) => {
        if (error) {
            res.json({});
        }
        res.json(data);
    });
});

app.get('/single_student', (req, res) => {
    const student_id = req.query.id;
    student.findById(student_id).then((data) => {
        res.json(data);
    });
});

app.post('/single_student', (req, res) => {
    const student_id = req.query.id;
    student.findByIdAndUpdate(student_id, {
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        phoneNumber: req.body.phone_number,
        email: req.body.email,
        dateOfBirth: req.body.date_of_birth,
        gender: req.body.gender,
        address: req.body.address,
        fatherName: req.body.father_name,
        motherName: req.body.mother_name,
        guardianName: req.body.guardian_name,
        guardianPhoneNumber: req.body.guardian_phone_number,
        classXMark: req.body.class_x_mark,
        classXIIMark: req.body.class_xii_mark,
        classXIISchool: req.body.class_xii_school,
        interests: req.body.interests,
    }).then(() => {
        res.location('http://localhost:3000/student/' + student_id);
        res.send(302);
    });
    // console.log(req.body);
    //TODO: Update the Databse.
});

app.post('/admission', (req, res) => {
    // console.log(req.body);

    // if(req.body.class_xii_mark < 75) {
    //   res.send("Marks too low, cannot admit");
    // }

    const newStudent = new student({
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        phoneNumber: req.body.phone_number,
        email: req.body.email,
        dateOfBirth: req.body.date_of_birth,
        gender: req.body.gender,
        address: req.body.address,
        fatherName: req.body.father_name,
        motherName: req.body.mother_name,
        guardianName: req.body.guardian_name,
        guardianPhoneNumber: req.body.guardian_phone_number,
        classXMark: req.body.class_x_mark,
        classXIIMark: req.body.class_xii_mark,
        classXIISchool: req.body.class_xii_school,
        interests: req.body.interests,
    });
    newStudent.save();

    res.location('http://localhost:3000/admission/success');
    res.send(302);
});