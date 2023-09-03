const { Router } = require("express");
const blogController = require('../controllers/blogs_controller');
const AuthMiddleware = require("../middlewares/auth.middleware");
const { uploadimage } = require("../helpers/multerImage.config")

const BlogRouter = Router();

// Get all blog posts
BlogRouter.route('/').get(AuthMiddleware, blogController.getAllBlogs);

// Create a new blog post
BlogRouter.route('/new').post(uploadimage.single('image'), AuthMiddleware, blogController.createBlog);

// Update a blog post
BlogRouter.route('/:id').put(AuthMiddleware, blogController.updateBlog);

// Delete a blog post
BlogRouter.route('/:id').delete(AuthMiddleware, blogController.deleteBlog);

module.exports = BlogRouter;
