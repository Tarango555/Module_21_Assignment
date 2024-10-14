import nodemailer from "nodemailer";

const SendEmail = async (EmailTo, EmailSubject, EmailText) => {
  try {
    // Create the Nodemailer transporter with your fixed Ethereal credentials
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'bryana96@ethereal.email', // Your fixed Ethereal username
        pass: 'JAxNt9BxZvZFSKYJ2R', // Your fixed Ethereal password
      },
    });

    // Set up email data
    let mailOptions = {
      from: '"Test Sender" <test@ethereal.email>', // sender address
      to: EmailTo, // receiver's email (pass it dynamically)
      subject: EmailSubject, // Subject line
      text: EmailText, // plain text body
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    // Preview the email in the browser by following the link below
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error occurred while sending email:', error);
  }
}

export default SendEmail;
