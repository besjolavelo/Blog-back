const blogService = require('../services/blogService');
const { StatusCodes } = require('http-status-codes')

exports.syncBlogs = async (req, res) => {
  try {
    const blogs = await blogService.fetchAllBlogs();
    await blogService.saveBlogsToDatabase(blogs);
    res.status(StatusCodes.OK).json({ message: 'Blogs successfully synced' });
  } catch (error) {
    console.error('Error syncing blogs:', error.message);  
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error syncing blogs' });
  }
};
