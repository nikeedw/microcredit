import nodemailer from 'nodemailer'
import google from 'googleapis'
import { EnvConfigs } from '../EnvConfigs'

export async function sendEmail({
    to,
    subject,
    html,
    priority = 'normal',
}: {
    to: string
    subject: string
    html: string
    priority?: 'high' | 'low' | 'normal'
}) {
    const oAuth2Client = new google.Auth.OAuth2Client(
        EnvConfigs.CLIENT_ID,
        EnvConfigs.CLIENT_SECRET,
        EnvConfigs.REDIRECT_URI,
    )

    oAuth2Client.setCredentials({ refresh_token: EnvConfigs.REFRESH_TOKEN })

    // const ACCESS_TOKEN = await oAuth2Client.getAccessToken()

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: EnvConfigs.SMTP_USER,
            clientId: EnvConfigs.CLIENT_ID,
            clientSecret: EnvConfigs.CLIENT_SECRET,
            refreshToken: EnvConfigs.REFRESH_TOKEN,
        },
    })

    const info = await transporter.sendMail({
        from: `MicroCredit <${EnvConfigs.SMTP_USER}>`,
        to,
        subject,
        text: '',
        html,
        priority,
    })

    const status = info.accepted ? 'Accepted' : 'Rejected'
    return status
}
