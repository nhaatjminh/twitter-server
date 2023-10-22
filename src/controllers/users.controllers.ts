import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.requests'
import usersService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  res.json({ message: 'Login success' })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    const result = await usersService.register(req.body)

    res.json({ message: 'Register success', result })
  } catch (error) {
    res.status(400).json({
      error: 'Register fail'
    })
  }
}
