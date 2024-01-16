var express = require('express');
var router = express.Router();
var userModel = require('./users');
var postModel = require('./posts')
var localStrategy = require('passport-local');
const passport = require('passport');
const upload = require('./multer')

passport.use(new localStrategy(userModel.authenticate()));

const isLoggedIn = (req,res,next)=>{
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}

router.get('/', function(req, res) {
  res.render('index', {footer: false});
});

router.get('/login', function(req, res) {
  res.render('login', {footer: false});
});

router.get('/feed', isLoggedIn,async function(req, res) {
  const posts = await postModel.find().populate("user")
  res.render('feed', {footer: true, posts });
});

router.get('/profile', isLoggedIn,async function(req, res) {
  const user = await userModel.findOne({username:req.session.passport.user}).populate("posts")
  // console.log(user)
  res.render('profile', {footer: true,user});
});

router.get('/search', isLoggedIn,function(req, res) {
  res.render('search', {footer: true});
});

router.get('/edit',isLoggedIn, function(req, res) {
  // var user = await userModel.findOne({username:req.session.passport.user})
  res.render('edit', {footer: true,user:req.user});
});

router.get('/upload', isLoggedIn,function(req, res) {
  res.render('upload', {footer: true});
});

router.post('/register',(req,res,next)=>{
  var User = new userModel({
    username:req.body.username,
    email:req.body.email,
    name:req.body.name,
  });
  userModel.register(User,req.body.password)
  .then((registeruser)=>{
    passport.authenticate("local")(req,res,()=>{
      res.redirect('/feed');
    })
  })
})

router.post('/login',passport.authenticate("local",{
  successRedirect:'/feed',
  failureRedirect:'/login'
}),(req,res,next)=>{});

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

router.post('/update',isLoggedIn,upload.single('image'), async(req,res,next)=>{
  const user =  await userModel.findOneAndUpdate(
    {username:req.session.passport.user},
    {
      username:req.body.username,
      name:req.body.name,
      bio:req.body.bio
    },
    {new:true})
    if(req.file){ 
      user.dp = req.file.filename
    }
    await user.save()
    res.redirect('/profile');

})
router.post('/upload',isLoggedIn,upload.single("image"),async (req,res,next)=>{
  const user = req.user
  const post = await postModel.create({
    Image:req.file.filename,
    user:user._id,
    caption:req.body.caption
  })
  user.posts.push(post._id)
  await user.save()
  res.redirect('/feed')
})

router.get('/username/:username', isLoggedIn,async function(req, res) {
  const searchTerm = new RegExp(`^${req.params.username}`, 'i');
   const users = await userModel.find({username:searchTerm})
   res.json(users)
  // res.render('search', {footer: true});
});


module.exports = router;
