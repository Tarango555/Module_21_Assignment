import bcrypt from 'bcrypt';
const saltRounds= 10;

export const hashingPassword= (password)=>{
    try {
        let hashedPassword = bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (err) {
        throw new Error('Error hashing the password: ' + err.message);
    }
};

export const comparingPassword = (password) =>{
    
}