const User = require("../models/user");
const Home = require("../models/home");

exports.gethome = (req, res, next) => {
  Home.find()
    .then(rows=>{
       console.log(rows);
  console.log("isArray:", Array.isArray(rows));
      res.render("store/user", {
      registeredHomes: rows || [],
      PageTitle: "Airbnb Home",
      CurrentPage: "Home",
      isloggedIn: req.isloggedIn,
      user:req.session.user
    })
  })
  .catch(error =>{
    console.log("error while reading home recors",error);
  });
};

exports.getBooking = (req, res, next) => {
  Home.find()
    .then(rows=>{
      console.log(rows);
      res.render("store/bookings", {
      registeredHomes:rows,
      PageTitle: "Bookings",
      CurrentPage: "Bookings",
      isloggedIn: req.isloggedIn,
      user:req.session.user
    });
  })
  .catch(error =>{
    console.log("error while reading home recors",error);
  });
};

exports.getfavourite = async (req, res, next) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.redirect('/login');
    }
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate('favourites');
    if (!user) {
      return res.redirect('/login');
    }
    res.render("store/favourite-list", {
      favourites: user.favourites || [],
      PageTitle: "My Favourites",
      CurrentPage: "Favourite",
      isloggedIn: req.isloggedIn,
      user: req.session.user
    });
  } catch (error) {
    console.log("Error fetching favourites:", error);
    res.redirect('/login');
  }
};
exports.postfavourite = async (req, res, next) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.redirect('/login');
    }
    const homeID = req.body.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.redirect('/login');
    }
    if(!user.favourites.includes(homeID)){
      user.favourites.push(homeID);
      await user.save();
    }
    res.redirect('/favourite-list');
  } catch (error) {
    console.log("Error adding to favourites:", error);
    res.redirect('/login');
  }
};
exports.gethomelist = (req, res, next) => {
  Home.find()
    .then(rows=>{
    res.render("store/home-list", {
      registeredHomes:rows,
      PageTitle: "Home list",
      CurrentPage: "Home list",
      isloggedIn: req.isloggedIn,
      user:req.session.user
    });
})
  .catch(error =>{
    console.log("error while reading home recors",error);
  });
};
exports.gethomedetails = (req, res, next) => {
  const homeID = req.params.homeID;
  Home.findById(homeID).then(home=>{
    if(!home){
      return res.redirect('/user');
    }
    res.render("store/home-detail",{
      home:home,
      PageTitle: "Home Details",
      CurrentPage: "Home Details",
      isloggedIn: req.isloggedIn,
      user:req.session.user
    });
  }).catch((error)=>{
    console.log("error while fetching Home",error);
  });
};
exports.deleteFavourite = async (req,res,next)=>{
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.redirect('/login');
    }
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.redirect('/login');
    }
    if(user.favourites.includes(homeId)){
      user.favourites = user.favourites.filter(favId => favId!== homeId);
      await user.save();
    }
    res.redirect('/favourite-list');
  } catch (error) {
    console.log("Error deleting favourite:", error);
    res.redirect('/login');
  }
};