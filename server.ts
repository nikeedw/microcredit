import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import createError from 'http-errors'
import express, { NextFunction, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import UserRouter from './src/routes/user-router'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.set('view engine', 'jade')

app.use('/api', UserRouter)

app.use((next: NextFunction) => {
    next(createError(404))
})

app.use((err: any, req: Request, res: Response) => {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(err.status || 500)
    res.render('error')
})
