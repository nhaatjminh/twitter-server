import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  res.json({ message: 'Login success' })
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await usersService.register({ email, password })

    res.json({ message: 'Register success' })
  } catch (error) {
    res.status(400).json({
      error: 'Register fail'
    })
  }
}
