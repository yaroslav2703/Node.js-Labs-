const sendmail = require('nodemailer');

async function Send(body)
{


    let transporter = sendmail.createTransport(
    {
        service: `${body.mfrom.split('@')[1]}`,
        auth: {
            user: `${body.mfrom}`, // generated ethereal user
            pass: `${body.fromps}` // generated ethereal password
        }
    });

    let info = await transporter.sendMail(
    {
        from: `"Im"<${body.mfrom}>`, // sender address
        to: `${body.mfor}`, // list of receivers
        subject: 'PSCP', // Subject line
        text: `${body.MS}`, // plain text body
        html: `<b>${body.MS}</b>` // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', sendmail.getTestMessageUrl(info));
}

module.exports.Send = Send;
