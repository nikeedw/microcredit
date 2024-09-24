import dotenv from 'dotenv'
dotenv.config()

export const EnvConfigs = {
    PORT: process.env.PORT ?? '8100',
    DATABASE_URL: process.env.DATABASE_URL || '',
    SECRET_KEY: process.env.SECRET_KEY || '',

    // SMTP
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: process.env.SMTP_PORT || '587',
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',

    CLIENT_ID: process.env.CLIENT_ID || '',
    CLIENT_SECRET: process.env.CLIENT_SECRET || '',
    REDIRECT_URI: process.env.REDIRECT_URI || '',
    REFRESH_TOKEN: process.env.REFRESH_TOKEN || '',
}
