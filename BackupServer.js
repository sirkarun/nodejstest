const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jwt = require("jwt-simple");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const SECRET = "sirkarun"; //ในการใช้งานจริง คีย์นี้ให้เก็บเป็นความลับ
const passport = require("passport");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: SECRET,//SECRETเดียวกับตอนencodeในกรณีนี้คือ MY_SECRET_KEY
}
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
  if(payload.sub=== "karun") done(null, true);
  else done(null, false);
});
passport.use(jwtAuth);

app.listen(3000, () => {
    console.log('Start server at port 3000.')
})
const requireJWTAuth = passport.authenticate("jwt",{session:false});
const books = require('./db')
const middleware = (req, res, next) => {
  /* ตรวจสอบว่า authorization คือ Boy หรือไม่*/
     if(req.headers.authorization === "Boy")
        next(); //อนุญาตให้ไปฟังก์ชันถัดไป
     else
        res.send("ไม่อนุญาต!!!!")
  }; 
  const loginMiddleware = (req, res, next) => {
    if(req.body.username === "karun" && 
       req.body.password === "tao") next();
    else res.send("Wrong username and password") 
    //ถ้า username password ไม่ตรงให้ส่งว่า Wrong username and password
 }

  app.get('/',requireJWTAuth, (req, res) => {
    res.send('Hello World')
  })

  
 app.post("/login", loginMiddleware, (req, res) => {
  const payload = {
    sub: req.body.username,
    iat: new Date().getTime()//มาจากคำว่า issued at time (สร้างเมื่อ)
 };
 
 res.send(jwt.encode(payload, SECRET));
 });
app.get('/books', (req, res) => {
  res.json(books)
})

app.get('/books/:id', (req, res) => {
    res.json(books.find(book => book.id === req.params.id))
  })

app.post('/books', (req, res) => {
    books.push(req.body)
    res.status(201).json(books)
})

app.put('/books/:id', (req, res) => {
    const updateIndex = books.findIndex(book => book.id === req.params.id)
    res.json(Object.assign(books[updateIndex], req.body))
  })

  app.delete('/books/:id', (req, res) => {
    const deletedIndex = books.findIndex(book => book.id === req.params.id)
    books.splice(deletedIndex, 1)
    res.status(204).send()
 })