import StudentProfilesModel from "../models/StudentProfilesModel.js";
import StudentsModel from "../models/StudentsModel.js";
import GenerateStudentID from "../utility/studentID.js";
import SendEmail from "../utility/emailUtilityEthereal.js";
import mongoose from "mongoose";
import { hashingPassword } from "../utility/passwordHashing.js";
import {
    CreateAccessToken,
    CreateRefreshToken,
    StoreRefreshTokenInCookie,
} from "../utility/tokenUtility.js";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url'; // New import to handle URLs in ES modules

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const RegistrationService= async(req)=>{
    
    //Initiate session and start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        //Extract data from Request Body
        let {student_email, semester, admission_year}= req.body;
        
        // Check if the student already exists in the "student_profiles" collection
        let doesTheStudentExist= await StudentProfilesModel.findOne({student_email: student_email});
        if(doesTheStudentExist){
            await session.abortTransaction();
            return {status: 'fail', message: `Email ${student_email} already exists`};
        }

        //Then create student profile in "student_profiles" collection
        await StudentProfilesModel.create([req.body], {session});

        // Loop to ensure unique Student ID
        let StudentID;
        let isIdMatched;
        do {
            //Generate a unique Student ID
            StudentID = GenerateStudentID(semester, admission_year);
            
            // Check if the generated Student ID already exists in the "students" collection
            isIdMatched = await StudentsModel.findOne({ student_id: StudentID }).session(session);
        } while (isIdMatched);


        //Set this unique ID and email to "students" collection
        //let studentsData = await StudentsModel.create([{student_email: student_email, student_id: StudentID}], {session});
        await StudentsModel.updateOne(
            { student_email: student_email },
            {$set: { student_email, student_id: StudentID }},
            { upsert: true, session }
        );

        await session.commitTransaction();

        //Send this ID to student's email
        let EmailText= `Your studentID is: ${StudentID}. Use this ID for login.\n\n`+
                       `You can log in using the following link: ...link...`;
        let EmailSubject= "Student ID";
        await SendEmail(student_email, EmailSubject, EmailText);
        
        return {status: "Success", message: "Registration Successful. Please check your email"};
    }
    catch(err){
        await session.abortTransaction();
        return {status: "fail", message: err.toString()};
    }finally{
        session.endSession();
    }
}


export const LoginService= async(req, res)=>{
    try {

        // Retrieve student_id and password from request body
        let {student_id: ID, password: PASS} = req.body;

        // Find data in 'students' collection using that student_id
        let isIdMatched= await StudentsModel.findOne({student_id: ID});
        if(!isIdMatched){
            return {status: 'fail', message: 'Invalid Student ID'};
        }

        // If find any data, hash the password and attach to 'students' collection 
        let hashedPassword = await hashingPassword(PASS);
        await StudentsModel.updateOne(
            {student_id: ID},
            {$set: {password: hashedPassword}}
        );

        // Generate the access token (short-lived)
        let email= isIdMatched.student_email;
        let AccessToken= CreateAccessToken(email, ID);
        
        // Generate the refresh token (long-lived)
        let RefreshToken= CreateRefreshToken(email, ID);

        //Then create AuthMiddleware

        // Store refresh token in a secure HTTP-only cookie
        await StoreRefreshTokenInCookie(res, "RefreshToken", RefreshToken);

        // Return the access token in the response body (for immediate use)
        return {
            status: "Success",
            message: "Student Login Successful",
            accessToken: AccessToken, // Client will use this access token in the headers
        };
    }
    catch(err){
        return {status: "fail", message: err.toString()};
    }
}


export const LogoutService= async(res)=>{
    try {
        res.clearCookie('RefreshToken');
        return {
            status: "Success",
            message: "Logged out Successfully"
        };
    }
    catch(err){
        return {status: "fail", message: err.toString()};
    }
}


export const ReadProfileService= async(req)=>{
    try {
        //Retrieve data from req.user
        const email = req.user['student_email'];

        //Match stage
        let MatchStage= {$match: {student_email: email}};

        //Projection stage
        let ProjectStage= {
            $project: {
                _id: 0,
                first_name: 1,
                student_email: 1,
                student_phone: 1
            }
        };

        //Retrieve data from 'student_profiles'
        let profileData = await StudentProfilesModel.aggregate([
            MatchStage,
            ProjectStage
        ]);

        return {
            status: "Success",
            message: "Profile read Successful",
            data: profileData
        };
    }
    catch(err){
        return {status: "fail", message: err.toString()};
    }
};


export const UpdateProfileService = async (req) => {
    try {
        const userEmail = req.user.student_email;  // Extracted from the verified JWT by middleware
        const { student_email } = req.body;        // Extracted from the request body

        // Authorization check: Ensure the user is only updating their own profile
        if (student_email !== userEmail) {
            return { status: 403, message: 'Unauthorized to update this profile' };
        }

        // Check if the profile exists before updating
        const profileExists = await StudentProfilesModel.findOne({ student_email });
        if (!profileExists) {
            return { status: 404, message: "Student profile not found" };
        }

        // Update the profile
        let updatedData = await StudentProfilesModel.updateOne(
            { student_email },  // Filter by student email
            { $set: req.body }  // Update fields in the profile
        );

        return {
            status: 200,
            message: "Profile Updated Successfully",
            data: updatedData
        };
    } catch (err) {
        return { status: "fail", message: err.toString() };
    }
};


export const UpdateProfilePictureService = async (user, file) => {
    try {
        const email = user.student_email;

        // Find the student's profile by their email
        const studentProfile = await StudentProfilesModel.findOne({ student_email: email });
        if (!studentProfile) {
            // If no student profile found, delete the uploaded file to clean up
            fs.unlinkSync(file.path);
            return { status: 404, message: "Student profile not found" };
        }

        // If an old profile picture exists, delete it from the file system
        if (studentProfile.image) {
            const oldFilePath = path.join(__dirname, '../../', studentProfile.image);  // Now __dirname is available
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }


        // Update the new profile picture in the 'image' field of the student profile
        const imagePath = file.path;  // Using 'file' object directly (from Multer)
        // studentProfile.image = imagePath;  // Update the 'image' field in the model (multiple field)
        // await studentProfile.save();  // Save the updated student profile

        // For single field update
        await StudentProfilesModel.updateOne(
            { student_email: user.student_email },
            { $set: { image: imagePath } }
        );


        return {
            status: 200,
            message: "Profile picture updated successfully",
            data: { image: file.path }
        };
    } catch (err) {
        // If there's an error, delete the uploaded file to avoid leftovers
        if (file && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        return { status: 500, message: err.toString() };
    }
};


// Service for uploading birth certificate
export const UploadBirthCertificateService = async (user, file) => {
    try {
        const email = user.student_email;

        // Find the student's profile
        const studentProfile = await StudentProfilesModel.findOne({ student_email: email });
        if (!studentProfile) {
            fs.unlinkSync(file.path);  // Delete the uploaded file if no profile is found
            return { status: 404, message: "Student profile not found" };
        }

        // If an old birth certificate exists, delete it from the file system
        if (studentProfile.birth_certificate) {
            const oldFilePath = path.join(__dirname, '../../', studentProfile.birth_certificate);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);  // Delete old birth certificate
            }
        }

        // Save the new birth certificate path to the 'birth_certificate' field
        studentProfile.birth_certificate = file.path;
        await studentProfile.save();

        return {
            status: 200,
            message: "Birth certificate uploaded successfully",
            data: { birth_certificate: file.path }
        };
    } catch (err) {
        // If there's an error, delete the uploaded file to avoid leftovers
        if (file && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        return { status: 500, message: err.toString() };
    }
};


export const GetProfilePictureService = async (req) => {
    try {
        const email = req.user.student_email;

        // Fetch the student profile from the database
        const studentProfile = await StudentProfilesModel.findOne({ student_email: email });

        // Check if the student profile or profile picture does not exist
        if (!studentProfile || !studentProfile.image) {
            return { status: 404, message: 'Profile picture not found' }; // Return 404 for not found
        }

        // Build the URL for the profile picture
        const profilePictureUrl = `${req.protocol}://${req.get('host')}/${studentProfile.image}`;

        // Return the profile picture URL and success status
        return {
            status: 200,
            message: 'Profile picture retrieved successfully',
            data: {
                profile_picture_url: profilePictureUrl
            }
        };
    } catch (err) {
        // Return error status 500 and error message if an exception occurs
        return { status: 500, message: err.toString() };
    }
};


export const DeleteProfilePictureService = async (user) => {
    try {
        const email = user.student_email;

        // Find the student's profile
        const studentProfile = await StudentProfilesModel.findOne({ student_email: email });

        if (!studentProfile || !studentProfile.image) {
            return { status: 404, message: "Profile picture not found" };
        }

        // Get the path of the old profile picture
        const oldFilePath = path.join(__dirname, '../../', studentProfile.image);

        // Check if the file exists, and delete it
        if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);  // Delete the file from the file system
        }

        // Clear the image field from the database
        studentProfile.image = 'uploads/default-profile.png'; //default value
        await studentProfile.save();

        return { status: 200, message: "Profile picture deleted successfully" };
    } catch (err) {
        return { status: 500, message: err.toString() };
    }
};
