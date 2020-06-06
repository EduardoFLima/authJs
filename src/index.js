require('./models/User');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const requireAuth = require('./middlewares/requireAuth');
const mongoose = require('mongoose');
const { MONGODB_PASSWORD } = require('./secrets');

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);


app.get('/', requireAuth, (req, res) => {
    res.send({ message: `Hello ${req.user.email}! You were authorized to be here!` });
});

app.listen(3000, (req, res) => {
    console.log('listening on port 3000');
});

mongoose.connect(`mongodb+srv://test_user:${MONGODB_PASSWORD}@cluster0-1ors7.gcp.mongodb.net/test_user?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

mongoose.connection.on('connected', () => {
    console.log('connected to mongoDB!');
});