import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface EmailData{
    to:string;
    subject:string;
    html:string;
    from:string;
}

export async function sendEmail(emailData: EmailData): Promise<void> {

const msg={
    to:emailData.to , 
    from:emailData.from,
    subject:emailData.subject ,
    html:emailData.html ,
}

  try {
    const response = await sgMail.send(msg); // Capture the response (optional)
        console.log('Email sent successfully to ', emailData.to);
        if (response && response[0]) {
            console.log("SendGrid Response:", response[0].statusCode); // Log status code
        }
  } catch (error:any) {
    console.error("Error sending email: ", error);
    if(error.response){
     console.error(error.response.body);
    }
  }
}
