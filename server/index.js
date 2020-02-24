require('dotenv').config();
const express = require('express');
const app = express();
const massive = require('massive')
const session = require('express-session')
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const { CONNECTION_STRING, SESSION_SECRET } = process.env;
const port = 4000;
app.listen(port, () => {
    console.log(`Running on port, ${port}`)
});

app.use(express.json());

app.use(
    session({
      secret: SESSION_SECRET,
      resave: true,
      saveUninitialized: false
    })
  );

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log("connected")
  });


  app.post('/auth/register', authCtrl.register);

  app.post('/auth/login', authCtrl.login);

  app.get('/auth/logout', authCtrl.logout);

  app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);