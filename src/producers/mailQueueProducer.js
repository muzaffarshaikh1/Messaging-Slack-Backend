import mailQueue from '../queues/mailQueue.js'
import '../processors/mailProcessor.js'
export const addEmailToMailQueue = async (emailData) =>{
    try {
        await mailQueue.add(emailData);
        console.log("email added to the queue");
    } catch (error) {
        console.log('add email to mail queue:',error);
    }
}