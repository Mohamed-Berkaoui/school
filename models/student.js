const { default: mongoose } = require("mongoose");

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

  module.exports=StudentModel