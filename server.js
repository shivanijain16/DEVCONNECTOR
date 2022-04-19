const express = require('express');
const connectDb = require('./config/db')

const app = express();
const cors = require('cors');

connectDb();

//init middleware
// adding bodyParser it is already there in express so no need to add bodyParser.json()
app.use(express.json({ extended: false }));
//to allow cross - origin 
app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.send("API Running")
})

// define API routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started running on port ${PORT}`));