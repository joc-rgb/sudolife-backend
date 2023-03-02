import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

//Add own new property in existing interface
declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthPayload;
    }
  }
}

export interface AuthPayload {
  userId: string;
  uId: string; //redis purpose
  email: string;
  username: string;
  avatarColor: string;
  iat?: number;
}

//MongoDB
export interface IAuthDocument extends Document {
  _id: string | ObjectId;
  uId: string;
  username: string;
  email: string;
  password?: string;
  avatarColor: string;
  createdAt: Date;
}

export interface ISignUpData {
  _id: ObjectId;
  uId: string;
  email: string;
  username: string;
  password: string;
  avatarColor: string;
}

export interface IAuthJob {
  value?: string | IAuthDocument;
}
