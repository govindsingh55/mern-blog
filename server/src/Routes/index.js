import express from "express";
import { checkAuth } from "../Middleware/auth";
import { BlogController, UserController } from "../Controller";

const router = express.Router();

router.get('/hello', async (req, res) => res.send('hello world!'));
router.post('/login', UserController.login);
router.get('/writers', checkAuth(['ADMIN']), UserController.getWriters)
router.post('/writer', checkAuth(['ADMIN']), UserController.addWriter);
router.delete('/writer/:writerId', checkAuth(['ADMIN']), UserController.deleteWriter);

router.get('/blogs', BlogController.blogList);
router.get('/blog/:blogId', BlogController.blogById);

router.post('/blog', checkAuth(['ADMIN', 'CONTENT-WRITER']), BlogController.addBlog);
router.patch('/blog', checkAuth(['ADMIN', 'CONTENT-WRITER']), BlogController.updateBlog);
router.delete('/blog/:blogId', checkAuth(['ADMIN', 'CONTENT-WRITER']), BlogController.deleteBlog);

export default router;