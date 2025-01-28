const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const connectToDb = require("./utils/connectToDb");

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (email) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
      },
      message: "email is not valid",
    },
    unique: true,
  },
  phone: { type: Number, unique: true },
  salary: { type: Number },
});

const TeacherModel = mongoose.model("teacher", teacherSchema);

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (email) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
      },
      message: "email is not valid",
    },
    unique: true,
  },
  phone: { type: Number, unique: true },
  teacherId: { type: mongoose.Types.ObjectId, ref: "teacher", required: true },
});

const StudentModel = mongoose.model("student", studentSchema);
const app = express();
connectToDb();

app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.get("/", async function (req, res) {
  const teachers = await TeacherModel.find();
  const students = await StudentModel.find().populate("teacherId");

  res.render("index.ejs", { teachers, students });
});

app.get("/addteacher", function (req, res) {
  res.render("addteacher.ejs");
});
app.post("/addteacher", async function (req, res) {
  try {
    const teacher = new TeacherModel(req.body);
    await teacher.save();
    res.redirect("/");
  } catch (error) {
    res.send({ status: "error", message: error.message });
  }
});

app.get("/addstudent", async function (req, res) {
  const teachers = await TeacherModel.find();

  res.render("addstudent.ejs", { teachers });
});

app.post("/addstudent", async function (req, res) {
  try {
    const student = new StudentModel(req.body);
    await student.save();
    res.redirect("/");
  } catch (error) {
    res.send({ status: "error", message: error.message });
  }
});

app.get("/update/teacher/:id", async function (req, res) {
  try {
    const oldTeacher = await TeacherModel.findById(req.params.id);
    res.render("updateteacher.ejs", { oldTeacher });
  } catch (error) {
    res.send({ status: "error", message: error.message });
  }
});
app.post("/update/teacher/:id", async function (req, res) {
  try {
    delete req.body.email;
    await TeacherModel.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/");
  } catch (error) {
    res.send({ status: "error", message: error.message });
  }
});

app.get("/delete/teacher/:id", async function (req, res) {
  try {
    const hasStudents = await StudentModel.find({ teacherId: req.params.id });
    if (!hasStudents.length) {
      await TeacherModel.findByIdAndDelete(req.params.id);
      res.redirect("/");
      return;
    }

    res.redirect("/fail");
  } catch (error) {
    res.send({ status: "error", message: error.message });
  }
});

app.get("/fail", function (req, res) {
  res.render("fail.ejs");
});

app.listen(process.env.PORT, function () {
  console.log(`server running on port ${process.env.PORT}`);
});
