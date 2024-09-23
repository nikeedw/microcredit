import { Request, Response } from 'express'
import { prisma } from '../../prisma/prisma-client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { EnvConfigs } from '../EnvConfigs'
import { UserPayload } from '../middlewares/checkJwt'

export const UserHandler = {
    register: async (req: Request, res: Response) => {
        const { email, password, username } = req.body
        if (!email || !password || !username) {
            return res.status(400).json({ error: 'All fields are required!' })
        }

        try {
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [{ email: email }, { username: username }],
                },
            })
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists!' })
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
            return res.status(500).json({ error: 'Internal server error' })
        }
    },
    login: async (req: Request, res: Response) => {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ error: 'All fields are required!' })
        }

        try {
            const user = await prisma.user.findUnique({ where: { username } })

            if (!user) {
                return res.status(400).json({ error: 'Wrong login or password' })
            }

            const valid = await bcrypt.compare(password, user.password)

            if (!valid) {
                return res.status(400).json({ error: 'Wrong login or password' })
            }

            const token = jwt.sign({ userId: user.id }, EnvConfigs.SECRET_KEY)

            return res.json({ token })
        } catch (error) {
            console.log('Login error', error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    },
    current: async (req: Request, res: Response) => {
        const id = getParsedJwt(req, res)?.userId

        try {
            const user = await prisma.user.findUnique({
                where: { id },
            })

            if (!user) {
                return res.status(400).json({ error: 'Unable to found the user' })
            }

            return res.status(200).json(user)
        } catch (error) {
            console.log('err', error)
            return res.status(500).json({ error: 'Something went wrong' })
        }
    },
}

const getParsedJwt = (req: Request, res: Response) => {
    // get user from jwt
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }

    try {
        return jwt.verify(token, EnvConfigs.SECRET_KEY) as UserPayload
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }
}
