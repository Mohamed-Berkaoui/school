const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const connectToDb = require("./utils/connectToDb");
const contorllers = require("./controllers/controllers");

const app = express();

connectToDb();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", contorllers.getIndexPage);
app.get("/addteacher", contorllers.getAddTeacherPage);
app.post("/addteacher", contorllers.addTeacher);
app.post("/addstudent", contorllers.addStudent);
app.route("/update/teacher/:id")
.get(contorllers.getUpdateTeacherPage)
.post(contorllers.updateTeacher)
app.get("/delete/teacher/:id", contorllers.deleteTeacher);
app.get("/addstudent", contorllers.getAddStudentPage);
app.get("/update/student/:id", contorllers.getUpdateStudentPage);
app.post("/update/student/:id", contorllers.updateStudent);
app.get("/delete/student/:id", contorllers.deleteStudent);
app.get("/fail", contorllers.getFailPage);


app.all('*',function(req,res){
  res.render('404.ejs')
})

app.use(function(error,req,res,next){
  res.send({ status: "error", message: error.message });
}) 

mongoose.connection.once("open", function () {
  app.listen(process.env.PORT, function () {
    console.log(`server running on port ${process.env.PORT}`);
  });
});

mongoose.connection.on("error", function () {
  process.exit(1);
});
