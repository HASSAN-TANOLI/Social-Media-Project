const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDatabase = require('./config/database');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');



dotenv.config({path: 'config/config.env'})

// mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology : true}, () => {
  
//   console.log('connected to mongoDB')
// });

//Connecting to database
connectDatabase();


//Midleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));


app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);




const server= app.listen(process.env.PORT, () => {
  console.log(`server started on port: ${process.env.PORT}`)
});

