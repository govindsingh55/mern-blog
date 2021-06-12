import * as yup from 'yup';
import { BlogModel } from '../Model';

export default {
  blogById: async (req, res) => {
    try {
      const blogId = req.params.blogId;
      const blog = await BlogModel.findOne({ _id: blogId }).populate('user').populate('publish.publishedBy');
      if (!blog) {
        return res.status(404).json({
          error: {
            type: 'DOCUMENT_NOT_FOUND',
            message: 'Blog not found!'
          }
        })
      }

      return res.status(200).json({
        data: {
          blog
        }
      })
    } catch (error) {
      console.log('error : ', error);
      return res.status(500).json({
        error: {
          type: "SERVER_ERROR",
          message: "something went wrong",
          error: error
        }
      })
    }
  },

  blogList: async (req, res) => {
    try {
      const { limit = 10, page = 1 } = req.query;
      let filter = {};
      if (req.user && req.user.role === 'CONTENT-WRITER') {
        filter = { user: req.user._id }
      }
      const blogList = await BlogModel.find(filter).populate('user').populate('publish.publishedBy').limit(limit * 1).skip((page - 1) * limit).exec();

      return res.status(200).json({
        data: {
          length: blogList.length,
          blogs: blogList,
          limit,
          page
        }
      });
    } catch (error) {
      console.log('error : ', error);
      return res.status(500).json({
        error: {
          type: "SERVER_ERROR",
          message: "something went wrong",
          error: error
        }
      })
    }
  },

  addBlog: async (req, res) => {
    try {
      const { title, slug, description, content } = req.body;

      // input validation
      const schema = yup.object().shape({
        title: yup.string().min(5).max(150).required(),
        description: yup.string().min(5).max(250).required(),
        slug: yup.string().min(5).max(200).required(),
        // TODO: validation should be added for blog content
        // content: yup.object().required()
      });

      await schema.validate(req.body, { abortEarly: false }).catch(err => {
        return res.status(400).json({
          error: {
            type: 'INPUT_VALIDATION_FAILED',
            message: "input in not valid!",
            error: err
          }
        })
      });

      const blog = await BlogModel.findOne({ slug: slug });
      if (blog) {
        return res.status(409).json({
          error: {
            message: "blog already exist with slug!",
            type: 'DOCUMENT_ALREADY_EXIST',
          }
        })
      }
      const newBlog = await new BlogModel({
        title,
        slug,
        description,
        content: JSON.stringify(content),
        user: req.user._id
      }).save();

      return res.status(200).json({
        data: newBlog
      });
    } catch (error) {
      console.log('error : ', error);
      return res.status(500).json({
        error: {
          type: "SERVER_ERROR",
          message: "something went wrong",
          error: error
        }
      })
    }
  },

  updateBlog: async (req, res) => {
    try {
      const { _id, title, slug, description, content } = req.body;

      // input validation
      const schema = yup.object().shape({
        title: yup.string().min(5).max(150).required(),
        description: yup.string().min(5).max(250).required(),
        slug: yup.string().min(5).max(200).required(),
        _id: yup.string().min(24).max(24).required()
        // TODO: validation should be added for blog content
        // content: yup.object().required()
      });

      await schema.validate(req.body, { abortEarly: false }).catch(err => {
        return res.status(400).json({
          error: {
            type: 'INPUT_VALIDATION_FAILED',
            message: "input in not valid!",
            error: err
          }
        })
      });

      const blog = await BlogModel.findOne({ _id: _id });
      if (!blog) {
        return res.status(404).json({
          error: {
            message: "blog not found!!",
            type: 'DOCUMENT_NOT_FOUND',
          }
        })
      }

      if (blog.user !== req.user._id || req.user.role !== 'ADMIN') {
        return res.status(401).json({
          error: {
            message: "Not authorised to update!",
            type: 'NOT_AUTHORISED',
          }
        })
      }

      blog.title = title;
      blog.slug = slug;
      blog.content = JSON.stringify(content);
      blog.description = description;

      const newBlog = await blog.save();

      return res.status(200).json({
        data: newBlog
      });
    } catch (error) {
      console.log('error : ', error);
      return res.status(500).json({
        error: {
          type: "SERVER_ERROR",
          message: "something went wrong",
          error: error
        }
      })
    }
  },

  deleteBlog: async (req, res) => {
    try {
      const blogId = req.params.blogId;
      let filter = {
        _id: blogId
      }
      if (req.user.role === 'CONTENT-WRITER') {
        filter.user = req.user._id
      }

      await BlogModel.deleteOne(filter);

      return res.status(200).json({
        data: "success"
      });
    } catch (error) {
      console.log('error : ', error);
      return res.status(500).json({
        error: {
          type: "SERVER_ERROR",
          message: "something went wrong",
          error: error
        }
      })
    }
  }
}