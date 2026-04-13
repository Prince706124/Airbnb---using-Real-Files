const http = require('http')
const path = require('path')
const express = require('express');
const multer = require('multer');
const rootDir = require('./utils/path');
const userRouter = require('./routes/user');
const {hostRouter} = require('./routes/host');
const authRouter = require('./routes/authrouter');
const app = express();
const errorcontroller = require('./controllers/error')
const {default: mongoose} = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const DB_PATH = "mongodb+srv://root:Raj706124%40@prince.tj1p3iq.mongodb.net/airbnb?appName=Prince";


app.set('view engine','ejs');
app.set('views','views');

const store = new MongoDBStore({
    uri: DB_PATH,
    collection: 'sessions'
});

const randomstring = (length)=>{
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i=0; i<length; i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};  
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename: (req,file,cb)=>{
        cb(null,randomstring(10)+'-'+file.originalname);
    }
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image/')){
        cb(null,true);  
    }
    else{
        cb(null,false);
    }
};

app.use(express.urlencoded({extended:true}));
app.use(multer({storage, fileFilter}).single('photo'));
app.use(express.static(path.join(rootDir, 'public')));
app.use('/uploads',express.static(path.join(rootDir,'uploads')));
app.use('/host/uploads',express.static(path.join(rootDir,'uploads')));
app.use('/homes/uploads',express.static(path.join(rootDir,'uploads')));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,  // 1 hour
        httpOnly: true
    }
}));
app.use((req,res,next)=>{
    console.log("Session Middleware Loaded",req.session);
    req.isloggedIn = req.session.isloggedIn;
    next();
});
app.use('/',userRouter);
app.use('/host',(req,res,next)=>{
    if(req.isloggedIn){
        next();
    }else{
        res.redirect('/login');
    }
},hostRouter);
app.use(authRouter);
app.use(errorcontroller.get404);


const server = http.createServer(app);
const PORT = 3002;
mongoose.connect(DB_PATH).then(()=>{
    server.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}/`);
    });
}).catch((err)=>{
    console.log('Error connecting to Mongo:', err);
});
