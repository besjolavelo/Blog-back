require('dotenv').config(); //   from .env
const express = require('express');
const connectToDatabase = require('./config/database');
const PORT = require('./config/server');
const { fetchAndSavePosts } = require('./services/blogService');
const app = express();
const cors = require('cors');
const path = require('path');


app.use(express.urlencoded({ extended: true }));//is used to parse URL-encoded data,,makes the parsed data available in req.body
app.use(express.json());//JSON bodies and makes the parsed data available in req.body

app.use(cors());

app.use('/api/posts', require('./routes/post.route'));
app.use('/api/comments', require('./routes/comment.route'));
app.use('/api/categories', require('./routes/category.route'));
app.use('/api/tags', require('./routes/tag.route'));
app.use('/api/likes', require('./routes/like.route'));
app.use('/api/subscriptions', require('./routes/subscription.route'));
app.use('/api/media', require('./routes/media.route'));
app.use('/api/users', require('./routes/user.route'));

app.use('/api/blog', require('./routes/blog.route'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`Server listening at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Error starting the server:', err);
        process.exit(1);
    }
};

startServer();
