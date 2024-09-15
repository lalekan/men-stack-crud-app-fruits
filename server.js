// Here is where we import modules
const dotenv = require("dotenv")
dotenv.config()
// We begin by loading Express
const express = require("express");
const mongoose = require("mongoose")
const app = express();
const methodOverride = require("method-override"); // new

//=============== MONGOOSE ===============//
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.group(`connected to MongoDB ${mongoose.connection.name}`)
})

//Import Model from Fruit.js

const Fruit = require('./models/fruit.js')

// ========= MIDDLEWARE ========= /

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
const morgan = require("morgan");



// server.js

//============ROUTES===========//
app.get("/", async (req, res) => {
    res.render('index.ejs');
  });

  app.get("/fruits", async (req, res) => {
    const allFruits = await Fruit.find();
    console.log(allFruits); // log the fruits!
    res.render("fruits/index.ejs", { fruits: allFruits });
  });
  

app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs")
})

app.get("/fruits/:fruitId", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/show.ejs", { fruit: foundFruit });
});




// POST /fruits
app.post("/fruits", async (req, res) => {
  //  console.log(req.body);
  if(req.body.isReadyToEat === 'on') {
    req.body.isReadyToEat = true
  } else {
    req.body.isReadyToEat = false
  }
  // console.log(req.body)
  await Fruit.create(req.body)
  res.redirect("/fruits");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
