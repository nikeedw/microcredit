import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { EnvConfigs } from '../EnvConfigs'

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    try {
        if (!EnvConfigs.SECRET_KEY || !token || (token && !jwt.verify(token, EnvConfigs.SECRET_KEY))) {
            throw new Error('Not authorized')
        }

        next()
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

export interface UserPayload {
    userId: string
    // email: string;
    // username?: string;
}