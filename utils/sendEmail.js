import nodemailer from 'nodemailer';

const sendEmail = async (options) => {

    // create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Email Options
    const image = `<img src="cid:image@nodemailer.com" alt="DRAM Logo" width="350px" height="350px" style="display: block;margin: auto;border-radius: 20px;"/>`
    const emailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `<h1 dir='rtl'>${options.subject}</h1><h2 dir='rtl'>${options.message}</h2>${image}`,
        attachments: [{
            filename: 'logo.png',
            path: './public/images/logo.png',
            cid: 'image@nodemailer.com'
        }]
    };

    // Send Email
    await transporter.sendMail(emailOptions);
}

export default sendEmail;