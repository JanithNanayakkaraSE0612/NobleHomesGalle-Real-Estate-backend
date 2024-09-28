const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const connectDB = require('./config/database');
connectDB();  // Establish MongoDB connection

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
