import { Model, model, Schema } from "mongoose";
import validator from "validator";
import * as bcrypt from "bcryptjs";

interface IUser {
  email?: string;
  password?: string;
  tokens?: Array<string>;
}

// interface IUserDocument extends IUser, Document {

// }

interface IUserModel extends Model<IUserModel> {
  //statics
  findByCredentials: (email: string, password: string) => any;
}

const userSchema = new Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value: string) {
          if (!validator.isEmail(value)) {
            throw new Error("Email is invalid");
          }
        },
      },
      password: {
        type: String,
        required: true,
      },
      tokens: [
        {
          token: {
            type: String,
            required: true,
          },
        },
      ],
    },
    {
      timestamps: true,
    }
  );

  userSchema.virtual("requests", {
    ref: "ExchangeRequest",
    localField: "_id",
    foreignField: "id_usuario",
  });

  userSchema.static(
    "findByCredentials",
    async function findByCredentials(email: string, password: string) {
      const user: any = await this.findOne({ email });
  
      if (!user) {
        return null;
      }
  
      const isMatch = await bcrypt.compare(password, user.password!);
  
      if (!isMatch) {
        return null;
      }
  
      return user;
    }
  );

  userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
  });

  export default model<IUser, IUserModel>("User", userSchema);