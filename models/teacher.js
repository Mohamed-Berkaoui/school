const { default: mongoose } = require("mongoose");

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
module.exports=TeacherModel
