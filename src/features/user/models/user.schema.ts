import { IUserDocument } from '@user/interfaces/user.interface';
import mongoose, { model, Model, Schema } from 'mongoose';

const userSchema: Schema = new Schema({
  authId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', index: true },
  profilePicture: { type: String, default: '' },
  postsCount: { type: Number, default: 0 },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  passwordResetToken: { type: String, default: '' },
  passwordResetExpires: { type: Number },
  blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notifications: {
    messages: { type: Boolean, default: true },
    reactions: { type: Boolean, default: true },
    comments: { type: Boolean, default: true },
    follows: { type: Boolean, default: true }
  },
  social: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  work: { type: String, default: '' },
  school: { type: String, default: '' },
  location: { type: String, default: '' },
  quote: { type: String, default: '' },
  bgImageVersion: { type: String, default: '' },
  bgImageId: { type: String, default: '' }
});

const UserModel: Model<IUserDocument> = model<IUserDocument>('User', userSchema, 'User');
export { UserModel };

/**
 * The reason why there is no username, email, and password fields in this Mongoose schema is because these fields are likely defined in a separate Mongoose schema for the authentication system, which could be referenced by the authId field in this schema. This is a common design pattern for separating user data from authentication data in a database.

By having a separate authentication schema, it allows for more flexibility in how the authentication system is implemented, and also allows for the possibility of using different authentication methods (such as OAuth or SAML) without having to change the user schema. Additionally, by separating the authentication data from the user data, it can improve security by reducing the risk of exposing sensitive information like passwords or authentication tokens.
 */
