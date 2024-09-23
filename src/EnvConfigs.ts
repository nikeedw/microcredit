import dotenv from 'dotenv'
dotenv.config()

export const EnvConfigs = {
    PORT: process.env.PORT ?? '8100',
    DATABASE_URL: process.env.DATABASE_URL || '',
    SECRET_KEY: process.env.SECRET_KEY || ''
}