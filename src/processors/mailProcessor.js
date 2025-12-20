import mailQueue from "../queues/mailqueue.js";
import mailer from '../config/mailConfig.js'
mailQueue.process(async(job)=>{
    const emailData = job.data;
    console.log("Processing eamil",emailData);

    try {
        const response = await mailer.sendMail(emailData);
        console.log('email sent:',response)
    } catch (error) {
        console.log('Error processing email',error);
    }
})
