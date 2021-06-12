require('dotenv').config();
import bcrypt from "bcryptjs";

export async function hashPassword(password) {
  try {
    const rounds = parseInt(process.env.HASH_SALT || 10);

    const hash = await bcrypt.hash(password, rounds);
    return {
      data: hash,
      error: null
    }
  } catch (error) {
    console.log('error in hashing : ', error);
    return {
      data: null,
      error: {
        type: 'SERVER_ERROR',
        message: 'Error in hashing password!'
      }
    }
  }
}

export async function comparePassword({ password, hash }) {
  try {
    const res = await bcrypt.compare(password, hash);
    return {
      data: res,
      error: null
    }
  } catch (error) {
    console.log('error in password compare : ', error);
    return {
      data: null,
      error: {
        type: 'SERVER_ERROR',
        message: 'Error in comparing password!'
      }
    }
  }
}