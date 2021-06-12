require('dotenv').config();
import jwt from "jsonwebtoken";

export async function getToken(data) {
  try {
    const secretKey = process.env.TOKEN_SECRETKEY.replace(/\\n/gm, '\n') || 'supersecretkey'
    const token = await jwt.sign(data, secretKey, { expiresIn: '48h' });
    return {
      data: token,
      error: null
    }
  } catch (error) {
    console.log('error in token generation : ', error);
    return {
      data: null,
      error: {
        type: 'SERVER_ERROR',
        message: 'Error in generating token!'
      }
    }
  }
}

export async function verifyToken(token) {
  try {
    const secretKey = process.env.TOKEN_SECRETKEY.replace(/\\n/gm, '\n') || 'supersecretkey'
    const data = await jwt.verify(token, secretKey);
    return {
      data,
      error: null
    }
  } catch (error) {
    console.log('error in verifyng token : ', error);
    if (error && error.name === 'TokenExpiredError') {
      return {
        data: null,
        error: {
          type: 'TOKEN_EXPIRED',
          message: 'Token has expired. Login!'
        }
      }
    }
    return {
      data: null,
      error: {
        type: 'SERVER_ERROR',
        message: 'Error in generating token!'
      }
    }
  }
}