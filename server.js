const express = require('express');
const bodyParser= require('body-parser');
const morgan= require('morgan');
const createError= require ('http-errors');
require('dotenv').config();
// const initializePassport= require('./config/passportConfig');
// initializePassport(passport);
const app = express();
const port = process.env.PORT||3000;
const route= require('./api/routes');
const { sequelize } = require('./models');
sequelize.sync();

app.use(bodyParser.urlencoded({extended: false}));
// parse request data  content type
app.use(bodyParser.json());

app.use(morgan("combined"));

// Route init
route(app);
app.get('/', async(req, res,next) => {
  res.send('Welcome to Dance Sport!');
})
// app.use(async(req,res,next)=>{
//   // const error= new Error("Not Found")
//   // error.status=404;
//   // next(error)
//   next(createError.NotFound());
// })
app.use((err,req,res,next)=>{
  res.status(err.status||500)
  res.send({
    error:{
      status: err.status ||500,
      message: err.message
    },
  })
})

 app.listen(port, async() => {
  console.log(`Example app listening at http://localhost:${port}`)
 try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
