import Joi from "joi";
import { IUser } from "../interfaces/schema.js";

const signupSchema = Joi.object({
    fullName: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
    password:Joi.string().min(5).required()
})

const validateSignup = (user:IUser) => {
    return signupSchema.validate(user)
}

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password:Joi.string().min(5).required()
})

const validateLogin = (user: {email:string,password:string}) => {
    return loginSchema.validate(user)
}

export {validateSignup,validateLogin}