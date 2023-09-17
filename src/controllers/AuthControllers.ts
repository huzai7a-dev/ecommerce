import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { validateLogin, validateSignup } from "../validations/AuthValidation.js";
import { CLIENTERROR, CREATED, SERVERERROR, SUCCESS } from "../constant/ResponseStatus.js";
import User, { IUserDocument } from "../models/User.js";
import { IUser } from "../interfaces/schema.js";

const handleSignup = async (req: Request, res: Response) => {
    const {fullName, email,password} = req.body as IUser
    const { error } = validateSignup(req.body);
    if (error) return res.status(CLIENTERROR).send(error.details[0].message);

    const existingUser: IUserDocument | null = await User.findOne({ email });
    if (existingUser) return res.status(CLIENTERROR).send('Email already in use');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {     
        let user = await new User({
            email,
            fullName,
            password:hashedPassword
        })
        user = await user.save();
        return res.status(CREATED).send({fullName:user.fullName,email:user.email});
    } catch (error) {
        return res.status(SERVERERROR).send('Server Error')
    }
}

const handleLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    const { error } = validateLogin(req.body);    
    if (error) return res.status(CLIENTERROR).send(error.details[0].message);

    const user: IUserDocument | null = await User.findOne({email});
    if (!user) return res.status(CLIENTERROR).send('Email or password is incorrect');

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if(!isCorrectPassword) return res.status(CLIENTERROR).send('Email or password is incorrect');

    const token = jwt.sign({ email: user.email, fullName: user.fullName }, process.env.jwt_secret || '');

    return res.status(SUCCESS).send({data:token,message:'Login successfull'});

}

export {handleSignup,handleLogin}