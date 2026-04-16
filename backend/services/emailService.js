const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Create a transporter using Ethereal email for testing, or standard SMTP if provided
    let transporter;
    
    if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_USER) {
      // Bypassing ethereal account creation as ethereal service tends to drop connections and throw HTTP 500s.
      // Output the email context to stdout instead for testing.
      console.log('--- MOCK EMAIL TRIGGERED ---');
      console.log('TO:', options.email);
      console.log('SUBJECT:', options.subject);
      console.log('MESSAGE:', options.message);
      console.log('----------------------------');
      return;
    } else {
      transporter = nodemailer.createTransport({
        service: 'gmail', // or your preferred service/host
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    const mailOptions = {
      from: '"MediSlot Appointments" <noreply@medislot.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    
    if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_USER) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Email could not be sent', error);
  }
};

module.exports = sendEmail;
