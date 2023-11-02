import { NextFunction, Request, Response } from 'express'
import { pick } from '~/utils/common'

type FilterKeys<T> = Array<keyof T>

export const filterMiddleWare =
  <T>(filterKeys: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKeys)
    next()
  }
