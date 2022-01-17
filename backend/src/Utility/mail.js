import nodemailer from 'nodemailer'
import credentials from './credentials'
import Secret from "../Component/secret";

const delay = ms => new Promise(res => setTimeout(res, ms));

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const Random_Generate = () => {
    let result = '';
    for(let i= 0 ;i < 8;i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const GenerateCodeMail = ( to_email ) => {
    const secret = Random_Generate();
    const text = `Hi ${to_email}, Here is your authentication code ${secret}.`
    return { secret, text };
}

const sendCode = async ( to_email ) => {

    const { secret , text } = GenerateCodeMail( to_email );
    const wer = await Secret.findOne({ user : 'wpfinalmail@gmail.com' });
    const user = wer.user;
    const password = wer.password;
    const transpoter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: password,
        },
    });

    var mailOptions = {
        from: credentials.gmail.user,
        to: to_email,
        subject: 'WPFinal1101 Authentication code',
        text : text,
    };

    let result = 'noyet';

    transpoter.sendMail(mailOptions, (error, info) => {
        if(error) { console.log(error); result = null; }
        else { console.log('Email sent' + info.response); result = secret}
    })

    while(result === 'noyet'){
        await delay(3000);
    }
    
    return result;
}

export default sendCode