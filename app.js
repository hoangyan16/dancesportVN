require('dotenv').config();

const port = process.env.PORT || 3000;
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const route = require('./api/routes');
const { sequelize } = require('./models');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Enable CORS from client-side
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// const initializePassport= require('./config/passportConfig');
// initializePassport(passport);
global.__basedir = __dirname;
app.use(bodyParser.urlencoded({ extended: false }));
// parse request data  content type
app.use(bodyParser.json());

app.use(morgan("combined"));

// Route init
route(app);
app.get('/', async (req, res, next) => {
  res.send("Hello DanceSport")
});
// app.get('/weather', async(req, res,next) => {
//   request(`https://api.openweathermap.org/data/2.5/forecast?id=1581130&appid=3d0b99c0225d439a5b92b2b0f26135cd&units=metric`, function (error, response, body) {
//     let data=JSON.parse(body);
//   if(response.statusCode===200){
//     res.send(data);
//   } // Print the error if one occurred
//   });
// });
app.use(express.static(path.join(__dirname)));
// app.use(async(req,res,next)=>{
//   // const error= new Error("Not Found")
//   // error.status=404;
//   // next(error)
//   next(createError.NotFound());
// })
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    },
  })
})
app.use(cors())
app.listen(port, async () => {
  console.log(`env :${process.env.NODE_ENV}`)
  console.log(`Example app listening at http://localhost:${port}`)
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
