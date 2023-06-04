import * as mongoose from "mongoose";
import { UserStatusEnum } from "../enums/user-status-enum";
export const UserSchema = new mongoose.Schema({
  pseudo: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "Hello, I'm a new user !",
  },
  friendList : {
    type: [String],
  },
  status: {
    type: String,
    default: UserStatusEnum.OFFLINE,
  }
})
