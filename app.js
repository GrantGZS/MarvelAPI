
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const layouts = require("express-ejs-layouts");
const axios=require('axios');
const auth=require('./routes/auth');

//crypto hash
const crypto=require('crypto');

const session = require("express-session"); 
const MongoDBStore = require('connect-mongodb-session')
(session);
// *********************************************************** //
//  Loading JSON datasets
// *********************************************************** //
const courses = require('./public/data/courses20-21.json')
const Characters =require('./models/Character')
// *********************************************************** //
//  Loading models
// *********************************************************** //

const Course = require('./models/Course')
const MarvelFav=require('./models/MarvelFav')
// *********************************************************** //
//  Connecting to the database
// *********************************************************** //

const mongoose = require( 'mongoose' );
//const mongodb_URI = 'mongodb://localhost:27017/cs103a_todo'
//const mongodb_URI = 'mongodb+srv://cs_sj:BrandeisSpr22@cluster0.kgugl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//marvel:27cUpj8wfLfmuGqB
const mongodb_URI="mongodb+srv://marvel:27cUpj8wfLfmuGqB@cluster0.fule6.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect( mongodb_URI, { useNewUrlParser: true, useUnifiedTopology: true } );
// fix deprecation warnings
//mongoose.set('useFindAndModify', false); 
//mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("we are connected!!!")});
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var store = new MongoDBStore({
  uri: mongodb_URI,
  collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

app.use(require('express-session')({
  secret: 'This is a secret 7f89a789789as789f73j2krklfdslu89fdsjklfds',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(layouts)
app.use(auth)
app.use('/', indexRouter);
app.use('/users', usersRouter);

// middleware to test is the user is logged in, and if not, send them to the login page
const isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  }
  else res.redirect('/login')
}



app.get('/uploadDB',
  async (req,res,next) => {
    await Course.deleteMany({});
    await Course.insertMany(courses);

    const num = await Course.find({}).count();
    res.send("data uploaded: "+num)
  }
)



app.get('/simpleform',
(req,res,next)=>{
  isLoggedIn,
  res.render('simpleform')
})
app.post('/simpleform',
 (req,res,next)=>{
   //res.json(req.body);
   
   const{username,age,height}=req.body;
   res.locals.username=username;
   res.locals.age=age;
   res.locals.version='1.0.0';
   res.locals.ageInDays=365*age;
   res.locals.heightInCM=2.54*height;
   res.render('simpleformresult');
 })
//bmi
app.get('/bmi',
(req,res,next)=>{
  res.render('bmi')
})
app.post('/bmi',
 (req,res,next)=>{
   //res.json(req.body);
   const{height,weight}=req.body;

   res.locals.bmi=weight/(height*height)*703
   res.render('bmiResult');
 })
//dist
app.get('/dist',
(req,res,next)=>{
  res.render('dist')
})
app.post('/dist',
 (req,res,next)=>{
   //res.json(req.body);
   const{x,y,z}=req.body;

   res.locals.distance=Math.sqrt(x*x+y*y+z*z)
   res.render('distResult');
 })
//family
const family=[
  {name:'Tim',age:66},
  {name:'Grant',age:22}
]
app.get('/showFamily',
  (req,res,next) => {
    res.locals.family = family;
    res.render('showFamily');
  })

//API and github repos
app.get('/apidemo/:email',
  async (req,res,next) => {
    const email = req.params.email;
    const response = await axios.get('https://www.cs.brandeis.edu/~tim/cs103aSpr22/courses20-21.json')
    console.dir(response.data.length)
    res.json(response.data.slice(100,105));
    res.locals.courses = response.data.filter((c) => c.instructor[2]==email+"@brandeis.edu")
    res.render('showCourses')

    
  })

app.get('/myApiDemo',
 async(req,res,next) =>{
   const response = await axios.get('https://api.stackexchange.com/2.3/questions/no-answers?order=desc&sort=activity&site=stackoverflow')
   console.dir(response.data.length)
   ///res.json(response.data.slice(100,102));
   //console.dir(response.data);
   res.locals.overflows=response.data.items
   res.render("showStackOverflows")
   
 })

  app.get('/githubInfo/:githubId',
  async (req,res,next) => {
    const id = req.params.githubId;
    const response = await axios.get('https://api.github.com/users/'+id+'/repos')
    console.dir(response.data.length)
    //res.json(response.data.slice(0,1));
    res.locals.repos = response.data
    res.render('showRepos')
    
  })
  ///Final project app
  //function character(){
    //let urlParameters=new URLSearchParams(window.location.search),

  //}
var MarvelApi = require('marvel-api');
const Comics = require('./models/Comics');
const Character = require('./models/Character');
 
var marvel = MarvelApi.createClient({
  publicKey: '8d721bdf4a603c8f544ffc2a28e4aacc',
  privateKey: process.env.privateKey
});

app.get('/MarvelMain',
isLoggedIn,
async(req,res,next)=>{
  
  res.render('MarvelMain');
})
app.get('/UserProfile',

  isLoggedIn,
  async (req,res,next) => {
   try {
    res.render('UserProfile')
    //res.json(todoitems);
   }catch(e){
    next(e);
  }
  
})

app.get('/MarvelComics',
isLoggedIn,
async(req,res,next)=>{
  const getApiHash = require('marvel-api-hash-generator').getApiHash;
  const timeStamp = 1;
  const privateKey = process.env.privateKey;
   console.log(privateKey);
   const publicKey = '8d721bdf4a603c8f544ffc2a28e4aacc';
   const hashValue = getApiHash(timeStamp, privateKey, publicKey);

const requestConstantComics = 'https://gateway.marvel.com/v1/public/comics?';
const exampleUrl = `${requestConstantComics}ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}`;
console.log("example url");
console.log(exampleUrl);
res.locals.resultData=null;
res.render('MarvelComics');
})

app.post('/MarvelComics',
isLoggedIn,
async (req,res,next)=>{
  try{
  //console.log("         hi here:        ");
  const result=await marvel.comics.find(req.body.comicID);
  //console.log("         hi there:        ");
  //res.json(result);
  //console.dir(result.data[0].id);
  res.locals.resultData=result.data;
  console.log(
    " resultData updated "+res.locals.resultData.length
  )
  }catch(e){
    res.send("invalid comic id ");
    res.render('MarvelMain');
  }
  //.then(console.log)
  //.fail(console.error)
  
   res.render('MarvelComics')
})

app.get('/UserTeam',
isLoggedIn,
async(req,res,next)=>{
  
  res.render('UserTeam');
})




app.get('/showMarvel',
 async(req,res,next)=>{
  marvel.comics.findAll()
  .then(console.log)
  .fail(console.error)
  .done();
  res.redirect('/')
 })
  // app.get('/test',
  // async (req,res,next) =>{
  //   const baseURL="http://gateway.marvel.com/v1/public/comics?";
  //   const ts=Date.now();
  //   const publicKey='8d721bdf4a603c8f544ffc2a28e4aacc';
  //   const privateKey=process.env.privateKey;
  //   const hash=crypto.createHash('md5').update(ts+publicKey+privateKey).digest('hex');
  //   const URL=baseURL+"ts="+ts+"&apikey="+publicKey+"&hash="+hash;

  //   console.dir(URL);
  //   const response=await axios.get(baseURL+"ts="+ts+"&apikey="+publicKey+"&hash="+hash);
  //   console.dir(hash);
  //   console.dir(response.data.length);
  //   res.render('Marvel')
  // })

  
  app.get('/Marvel',
  isLoggedIn,
  async(req,res,next) =>{
    
    const getApiHash = require('marvel-api-hash-generator').getApiHash;
    const timeStamp = 1;
    const privateKey = process.env.privateKey;
     console.log(privateKey);
     const publicKey = '8d721bdf4a603c8f544ffc2a28e4aacc';
     const hashValue = getApiHash(timeStamp, privateKey, publicKey);

  const requestConstantCharacters = 'https://gateway.marvel.com/v1/public/characters?';
  const exampleUrl = `${requestConstantCharacters}ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}`;
   // https://gateway.marvel.com/v1/public/characters?ts=1&apikey=<public-key>&hash=09fe991c34996e64c0424e446f27c9f0
   console.log(("example     URL:"))
   console.log(exampleUrl);
   res.locals.resultData=null;
   res.render('Marvel')
  })

  app.post('/Marvel',
  isLoggedIn,
  async (req,res,next)=>{
    
    const result=await marvel.characters.findNameStartsWith(req.body.hero);
    //console.log("                  "+result.data.length);
    //res.json(result);
    //console.dir(result.data[0].id);
    res.locals.resultData=result.data;
    console.log(
      " resultData updated "+res.locals.resultData.length
    )
    //.then(console.log)
    //.fail(console.error)
     
     res.render('Marvel')
  })

 app.get('/creators',
 async(req,res,next)=>{
  const getApiHash = require('marvel-api-hash-generator').getApiHash;
  const timeStamp = 1;
  const privateKey = process.env.privateKey;
   console.log(privateKey);
   const publicKey = '8d721bdf4a603c8f544ffc2a28e4aacc';
   const hashValue = getApiHash(timeStamp, privateKey, publicKey);

const requestConstantCreators = 'https://gateway.marvel.com/v1/public/creators?';
const userKey=`ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}`;
console.dir(userKey);
const exampleUrl = `${requestConstantCreators}ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}`;
console.log(exampleUrl);
res.locals.timeStamp=timeStamp;
res.locals.publicKey=publicKey;
res.locals.hashValue=hashValue;
res.locals.userKey=userKey;
res.locals.resultData=null;
console.dir(res.locals);
res.render('MarvelCreator')
 })

 app.post('/creators',
 async(req,res,next)=>{
   console.log("hello");
   const getApiHash = require('marvel-api-hash-generator').getApiHash;
  const timeStamp = 1;
  const privateKey = process.env.privateKey;
   console.log(privateKey);
   const publicKey = '8d721bdf4a603c8f544ffc2a28e4aacc';
   const hashValue = getApiHash(timeStamp, privateKey, publicKey);

const requestConstantCreators = 'https://gateway.marvel.com/v1/public/creators?';
const userKey=`ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}`;
console.dir(userKey);
const exampleUrl = `${requestConstantCreators}ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}`;
console.log(exampleUrl);
res.locals.timeStamp=timeStamp;
res.locals.publicKey=publicKey;
res.locals.hashValue=hashValue;
res.locals.userKey=userKey;
   const result=await marvel.creators.findByName(req.body.creator);
   //res.json(result);
   //console.log("       creator result updated");
   //console.log(result);
   res.locals.resultData=result.data;
   console.dir(res.locals);
   try{
    const charName=req.body.charName;
    const resourceURI=req.body.resourceURI;
    const comicObj = {
      userId:res.locals.user._id,
      charName:charName,
      resourceURI:resourceURI
    }
    const newComic=new Comics(comicObj);
    await newComic.save();
  }catch(e){
    next(e);
  }
   res.render('MarvelCreator')
 })

 app.get('/addCharItem/:itemId/:itemName',
 isLoggedIn,
 async(req,res,next) =>{
   try{
   const charId=req.params.itemId;
   const charName=req.params.itemName;
   const charObj={
        id:charId,
        name:charName
   }
   const charItem=new Character(charObj);
   //await Character.insertOne(charObj);
   await charItem.save();
   const user=res.locals.user;
   user.favHeros.push(charItem);
   res.locals.user=user;
   res.render('UserProfile');    
   
  }catch(e){
     next(e);
   }
  }
  )





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
