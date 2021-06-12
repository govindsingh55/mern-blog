const { Schema, Types, model, models } = require("mongoose");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      default: 'CONTENT-WRITER',
      enum: ['ADMIN', 'CONTENT-WRITER']
    }
  },
  {
    timestamps: true,
    collection: 'User'
  }
)

UserSchema.index(
  {
    email: 'text',
    name: 'text'
  }
)

export default models.UserModel || model('UserModel', UserSchema);