const mongoose= require("mongoose");

module.exports = connectToDb = function (){
  mongoose
    .connect(process.env.DB_URI, { dbName: "school" })
    .then(() => console.log("connected to db "))
    .catch((e) => console.log(e.message));
};
