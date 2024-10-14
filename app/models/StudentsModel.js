import mongoose from "mongoose";

const DataSchema= new mongoose.Schema({
    student_email: {type: String, required: true, unique: true, lowercase: true},
    student_id: {type: String, required: true, unique: true},
    password: {type: String, required: true}
},
{
    timestamps: true,
    versionKey: false
});

const StudentsModel= mongoose.model('students', DataSchema);

export default StudentsModel;