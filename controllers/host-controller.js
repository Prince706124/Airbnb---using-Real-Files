const Home = require("../models/home");

exports.getaddhome = (req, res, next) => {
  res.render("host/edit-home", {
  PageTitle: "Add Home",
  CurrentPage: "Add Home",
  editing:false,
  home: false,
  isloggedIn: req.isloggedIn,
  user:req.session.user
  });
};
exports.postaddhome = (req, res, next) => {
  console.log(req.body);
  const { Name, price, rooms, food,description } = req.body;
  if(!req.file){
    return res.status(400).send("No file uploaded.");
  }
  const home = new Home({Name, price, rooms, photo: req.file.path, food,description});
  home.save().then(()=>{
    res.render("host/home-added", {
    PageTitle: "Submitted",
    CurrentPage: "Submitted",
    isloggedIn: req.isloggedIn,
    user:req.session.user
  });
  }).catch((error)=>{
    console.log("error adding Home",error);
  });
};
exports.getEditHome =(req,res,next)=>{
  const editing = req.query.editing==="true";
  const homeId = req.params.homeId;
  console.log(editing,homeId);
  Home.findById(homeId).then(home=>{
    if(!home){
      return res.redirect("host/host-homelist");
    }
    console.log(home);
    res.render("host/edit-home",{
    PageTitle : "Edit Home",
    CurrentPage: "editHome",
    editing: editing,
    homeId: homeId,
    home: home,
    isloggedIn: req.isloggedIn,
    user:req.session.user
  });
  });
};
exports.postedithome = (req,res,next)=>{
  const { id,Name, price, rooms,food,description } = req.body;
  Home.findById(id).then(home=>{
    home.Name = Name;
    home.price = price;
    home.rooms = rooms;
    home.photo = req.file ? req.file.path : home.photo;
    home.food = food;
    home.description = description;
    home.save().then(()=>{
      res.redirect("/host/host-homelist");
    }).catch((error)=>{
      console.log("Error Editing Home",error);
    });
  }).catch((error)=>{
    console.log("Error Finding Home",error);
  });
}

exports.gethome = (req, res, next) => {
  Home.find()
    .then(rows=>{
      console.log(rows);
    res.render("store/user", {
      registeredHomes:rows,
      PageTitle: "Airbnb Home",
      CurrentPage: "Home",
      isloggedIn: req.isloggedIn,
      user:req.session.user
    })
  });
};
exports.gethosthomelist = (req, res, next) => {
  Home.find()
    .then(rows=>{
      console.log(rows);
    res.render("Host/host-homelist", {
      registeredHomes:rows,
      PageTitle: "Host Home list",
      CurrentPage: "Host Home list",
      isloggedIn: req.isloggedIn,
      user:req.session.user
    })
});
};
exports.postdeletehome = (req,res,next)=>{
  const homeId = req.params.homeId;
  Home.findByIdAndDelete(homeId).then(()=>{
    res.redirect("/host/host-homelist");
  }).catch((error)=>{
    console.log("Error Deleting Home",error);
  })
}
