import mongoose, { Mongoose } from "mongoose";
import { Password } from "../services/password";

// an interface that describes properties requried to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// an interface that describes the properties that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// an interface that describe the properties that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

// tell mongoose about all different properties that a user will have
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.password; // remove a property from an object
      delete ret.__v;
      // rename property _id to id
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

// middleware function implemented in mongoose: any time save document to database, execute this function
userSchema.pre('save', async function(done) {
  // modify password: change the password, rehash it and save back to db
  // also return true when the user is first time created
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
})

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

// create mongoose model
// function model<T extends Document, U extends Model<T>>(......): U
const User: UserModel = mongoose.model<UserDoc, UserModel>('User', userSchema);

// use UserAttrs as a filter for properties before pass these properties to new User()

export { User };