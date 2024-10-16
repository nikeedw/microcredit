import { Request, Response } from 'express'
import { prisma } from '../../prisma/prisma-client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { EnvConfigs } from '../EnvConfigs'
import { UserPayload } from '../middlewares/checkJwt'
import { sendEmail } from '../adapters/email-adapter'
import { generateHtml } from '../helpers/generateHtml'

export const UserHandler = {
    register: async (req: Request, res: Response) => {
        const { email, password, username } = req.body
        if (!email || !password || !username) {
            return res.status(400).json({ error: 'Все поля обязательны' })
        }

        try {
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [{ email: email }, { username: username }],
                },
            })
            if (existingUser) {
                return res.status(400).json({ error: 'Пользователь уже существует' })
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    username,
                },
            })

            return res.json(user)
        } catch (error) {
            console.log('Register error', error)
            return res.status(500).json({ error: 'Что-то пошло не так' })
        }
    },
    login: async (req: Request, res: Response) => {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ error: 'Все поля обязательны' })
        }

        try {
            const user = await prisma.user.findUnique({ where: { username } })

            if (!user) {
                return res.status(400).json({ error: 'Неверный логин или пароль' })
            }

            const valid = await bcrypt.compare(password, user.password)

            if (!valid) {
                return res.status(400).json({ error: 'Неверный логин или пароль' })
            }

            const token = jwt.sign({ userId: user.id, email: user.email }, EnvConfigs.SECRET_KEY)

            return res.json({ token })
        } catch (error) {
            console.log('Login error', error)
            return res.status(500).json({ error: 'Что-то пошло не так' })
        }
    },
    current: async (req: Request, res: Response) => {
        const id = getParsedJwt(req, res)?.userId

        try {
            const user = await prisma.user.findUnique({
                where: { id },
            })

            if (!user) {
                return res.status(400).json({ error: 'Пользователь не найден' })
            }

            return res.status(200).json(user)
        } catch (error) {
            console.log('err', error)
            return res.status(500).json({ error: 'Что-то пошло не так' })
        }
    },
    sendEmail: async (req: Request, res: Response) => {
        const to = getParsedJwt(req, res)!.email

        try {
            const { amount, term } = req.body

            if (!amount || !term) {
                return res.status(400).json({ error: 'Все поля обязательны' })
            }

            const match = term.match(/\d+/)
            const numberTerm = parseInt(match[0], 10)

            const monthly = Math.ceil(Number(amount) / numberTerm + numberTerm * 0.2)

            const html = generateHtml(amount, term, monthly)

            const status = await sendEmail({
                to,
                subject: 'Your offer',
                priority: 'high',
                html,
            })
            return res.status(200).json({ status })
        } catch (error) {
            console.log('err', error)
            return res.status(500).json({ error: 'Что-то пошло не так' })
        }
    },
}

const getParsedJwt = (req: Request, res: Response) => {
    // get user from jwt
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        res.status(401).json({ error: 'Не авторизован' })
        return
    }

    try {
        return jwt.verify(token, EnvConfigs.SECRET_KEY) as UserPayload
    } catch (err) {
        res.status(401).json({ error: 'Не авторизован' })
        return
    }
}
