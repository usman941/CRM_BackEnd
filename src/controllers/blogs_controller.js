const Blog = require('../models/blogs');

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    const { title, content, author, date } = req.body;
    const image = req.file.filename;
    const blog = new Blog({ title, content, author, date, image });
    const savedBlog = await blog.save();
    res.json(savedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all blog posts
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a blog post
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { title, content, author });
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndRemove(req.params.id);
    res.json(deletedBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
