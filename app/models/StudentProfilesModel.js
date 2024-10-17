import mongoose from "mongoose";

const DataSchema= new mongoose.Schema({
    first_name: {type: String, required: true},
    middle_name: {type: String},
    last_name: {type: String},
    student_email: {type: String, required: true, unique: true, lowercase: true},
    student_phone: {type: String, required: true},
    blood_group: {type: String, required: true},
    date_of_birth:{type: Date, required: true},
    gender:{type: String, required: true},
    image:{type: String, required: true, default: 'uploads/default-profile.png'},
    birth_certificate:{type: String, required: true, default: 'uploads/default-bc.pdf'},
    guardian_name:{type: String, required: true},
    guardian_phone:{type: String, required: true},
    address:{type: String, required: true},
    department:{type: String, required: true},
    semester:{type: String, required: true},
    admission_year:{type: String, required: true}
},
{
    timestamps: true,
    versionKey: false
});

const StudentProfilesModel= mongoose.model('student_profiles', DataSchema);

export default StudentProfilesModel;