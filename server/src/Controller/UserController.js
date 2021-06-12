require('dotenv').config();
import * as yup from 'yup';
import { UserModel } from '../Model';
import { hashPassword, comparePassword } from '../utils/password';
import { getToken } from '../utils/token';

export default {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      // input validation
      const schema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().min(3).max(20).required()
      });

      await schema.validate(req.body, { abortEarly: false }).catch(err => {
        return res.status(400).json({
          type: 'INPUT_VALIDATION_FAILED',
          message: "input in not valid!",
          error: err
        })
      });

      const user = await UserModel.findOne({ email: email }).select('+password');

      if (!user) {
        return res.status(404).json({
          message: "user does not exist!",
          type: 'DOCUMENT_NOT_FOUND',
        })
      }

      const { data: passwordMatch, error } = await comparePassword({ password, hash: user.password });
      if (error) {
        return res.status(500).json(error)
      }

      if (!passwordMatch) {
        return res.status(400).json({
          type: 'INPUT_VALIDATION_FAILED',
          message: 'email or password does not match!'
        })
      }

      const { data: token, error: tokenError } = await getToken({
        _id: user._id,
        email: user.email,
        role: user.role
      });

      if (tokenError) {
        return res.status(500).json(tokenError)
      }

      return res.status(200).json({
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      })
    } catch (error) {
      console.log('error : ', error);
      return res.status(500).json({
        type: "SERVER_ERROR",
        message: "something went wrong",
        error: error
      })
    }
  },

  addWriter: async (req, res) => {
    try {
      const { email, password, name } = req.body;
      // input validation
      const schema = yup.object().shape({
        name: yup.string().min(3).max(20).required(),
        email: yup.string().email().required(),
        password: yup.string().min(3).max(20).required()
      });

      await schema.validate(req.body, { abortEarly: false }).catch(err => {
        return res.status(400).json({
          type: 'INPUT_VALIDATION_FAILED',
          message: "input in not valid!",
          error: err
        })
      });

      const user = await UserModel.findOne({ email: email });

      if (user) {
        return res.status(409).json({
          message: "user already exist!",
          type: 'DOCUMENT_ALREADY_EXIST',
        })
      }

      const { data: hash, error } = await hashPassword(password);
      if (error) {
        return res.status(500).json(error)
      }
      await UserModel.create({
        name,
        email,
        password: hash
      });

      return res.status(200).json({
        message: 'User registered successfully!'
      })
    } catch (error) {
      console.log('error : ', error);
      return res.status(500).json({
        type: "SERVER_ERROR",
        message: "something went wrong",
        error: error
      })
    }
  },

  deleteWriter: async (req, res) => {
    try {
      const userId = req.params.writerId;
      await await UserModel.deleteOne({ _id: userId });
      return res.status(200).json({
        message: 'user deleted successfully'
      })
    } catch (error) {
      console.log('error : ', error);
      return res.status(500).json({
        type: "SERVER_ERROR",
        message: "something went wrong",
        error: error
      })
    }
  },

  getWriters: async (req, res) => {
    try {
      const { limit = 10, page = 1 } = req.query;
      const users = await UserModel.find({ role: 'CONTENT_WRITER' });
      return res.status(200).json({
        users
      })
    } catch (error) {
      console.log('error : ', error);
      return res.status(500).json({
        type: "SERVER_ERROR",
        message: "something went wrong",
        error: error
      })
    }
  }
}