require('dotenv').config();
const axios = require('axios');
const Blog = require('../models/blogModel');


const API_KEY = process.env.BLOGGER_API_KEY;

const fetchAllBlogs = async () => {
  try {
    const response = await axios.get('https://www.googleapis.com/blogger/v3/users/self/blogs', {
      params: {
        key: API_KEY 
      }
    });
    return response.data.items; 
  } catch (error) {
    console.error('Error fetching blogs from Blogger API:', error);
    throw error;
  }
};

const saveBlogsToDatabase = async (blogs) => {
  try {
    const blogDocs = blogs.map(blog => ({
      id: blog.id,
      name: blog.name,
      url: blog.url,
      description: blog.description || ''
    }));

    for (const blog of blogDocs) {
      await Blog.updateOne({ id: blog.id }, blog, { upsert: true });
    }
  } catch (error) {
    console.error('Failed to save blogs to database', error);
    throw error;
  }
};

module.exports = {
  fetchAllBlogs,
  saveBlogsToDatabase
};
