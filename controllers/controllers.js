const StudentModel = require("../models/student");
const TeacherModel = require("../models/teacher");

async function getIndexPage(req, res) {
 try {
    const teachers = await TeacherModel.find();
    const students = await StudentModel.find().populate("teacherId");
  
    res.render("index.ejs", { teachers, students });
 } catch (error) {
    next(error)

 }
}

function getAddTeacherPage(req, res) {
  res.render("addteacher.ejs");
}

async function addTeacher(req, res) {
  try {
    const teacher = new TeacherModel(req.body);
    await teacher.save();
    res.redirect("/");
  } catch (error) {
next(error)
  }
}
async function addStudent(req, res) {
  try {
    const student = new StudentModel(req.body);
    await student.save();
    res.redirect("/");
  } catch (error) {
    next(error)

  }
}

async function getUpdateTeacherPage(req, res) {
  try {
    const oldTeacher = await TeacherModel.findById(req.params.id);
    res.render("updateteacher.ejs", { oldTeacher });
  } catch (error) {
    next(error)

  }
}

async function updateTeacher(req, res) {
  try {
    delete req.body.email;
    await TeacherModel.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/");
  } catch (error) {
    next(error)

  }
}


async function deleteTeacher(req, res) {
    try {
      const hasStudents = await StudentModel.find({ teacherId: req.params.id });
      if (!hasStudents.length) {
        await TeacherModel.findByIdAndDelete(req.params.id);
        res.redirect("/");
        return;
      }
      res.redirect("/fail");
    } catch (error) {
        next(error)

    }
  }

  async function getAddStudentPage(req, res) {
    const teachers = await TeacherModel.find();
  
    res.render("addstudent.ejs", { teachers });
  }

  async function getUpdateStudentPage(req, res) {
    try {
      const oldStudent = await StudentModel.findById(req.params.id)
      const teachers= await TeacherModel.find()
      res.render("updatestudent.ejs", { oldStudent ,teachers});
    } catch (error) {
        next(error)

    }
  }

  async function updateStudent(req, res) {
    try {
      delete req.body.email;
      await StudentModel.findByIdAndUpdate(req.params.id, req.body);
      res.redirect("/");
    } catch (error) {
        next(error)
    }
  }

  async function deleteStudent(req,res){
    try {
      await StudentModel.findByIdAndDelete(req.params.id);
      res.redirect("/");
  
    } catch (e) {
     next(e)
      
    }
  }

  function getFailPage(req, res) {
    res.render("fail.ejs");
  }
module.exports = {
    getFailPage,
    deleteStudent,
    deleteTeacher,
  getIndexPage,
  getUpdateStudentPage,
  getAddTeacherPage,
  getAddStudentPage,
  updateTeacher,
  updateStudent,
  addTeacher,
  addStudent,
  getUpdateTeacherPage,
};
