require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const connectDB = require('./server/route/config/db'); 
const { isActiveRoute } = require('./server/route/helpers/routeHelpers');

const app = express();
const PORT = process.env.PORT || 5000;
  
// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));

app.use(express.static('public'));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/index');
app.set('view engine', 'ejs');

 
app.locals.isActiveRoute = isActiveRoute; 


app.use('/', require('./server/route/main'));
app.use('/', require('./server/route/admin'));

app.get('/', (req,res) => {
  res.render('./views/layouts/index.ejs');
});

app.get('/login', (req,res) => {
  res.render('./views/admin/index.ejs');
});

app.listen(PORT, ()=> {
  console.log(`App listening on port ${PORT}`);
});