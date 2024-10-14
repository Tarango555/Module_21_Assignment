const GenerateStudentID=(semester, year)=>{
    
    //Collect last two digits of admission year
    if(typeof year === 'number'){
        year = year.toString();
    }
    let lastTwoDigits= year.slice(-2);
    
    //Create a random 5-digit number
    let num= Math.floor(10000 + Math.random() * 90000);

    //Collect semester code
    const semesterCodes={spring: "01", summer: "02", fall: "03"};
    const code= semesterCodes[semester.toLowerCase()];
    if (!code) {
        throw new Error("Invalid semester name. Choose between spring, summer, or fall.");
    }

    //Create the studentID
    return `${lastTwoDigits}-${num}-${code}`;
}

export default GenerateStudentID;