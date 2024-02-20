import Jwt from "jsonwebtoken";
export const createToken = (payload, userRole) => { return Jwt.sign({ _id: payload, role: userRole }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRED_TIME }) }
export const createResetToken = (payload) => { return Jwt.sign({ _id: payload }, process.env.JWT_RESET_PASSWORD_SECRET_KEY, { expiresIn: '30m' }) }
