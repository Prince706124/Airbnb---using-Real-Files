exports.get404 = (req,res,next)=>{
    res.status(404).render('404',{PageTitle:'Page not Found',isloggedIn: req.isloggedIn,CurrentPage:'404',user:req.session.user});
}