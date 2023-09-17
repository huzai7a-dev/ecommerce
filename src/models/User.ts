import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interfaces/schema.js';

export type IUserDocument = IUser & Document

const userSchema: Schema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: {
        type: String, required: true, unique: true
    },
    password: { type: String, required: true }
});

export default mongoose.model<IUserDocument>('Users', userSchema);