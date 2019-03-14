const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

function randomStr() {
  let random = '';
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++)
    random += possible.charAt(Math.floor(Math.random() * possible.length));

  return random;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

app.use((req, res, next) => {
  app.locals.username = users[req.cookies.id];
  next();
})

function emailCheck(input){
  for(id in users){
  if(users[id]['email'] === input){
    return true;
    }
  } return false;
}

function passwordTest(email, pass){
  for(user in users){
    if(users[user]['email'] === email){
      return(users[user]['password'] === pass)
    }
  } return false;
}


app.post("/urls", (req, res) => {
  console.log(req.body);
  let short = randomStr();
  urlDatabase[short] = req.body.longURL;
  res.redirect('/urls/' + short);

});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  console.log("in urls")
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
    console.log(users[req.cookies.id]['email']);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  console.log(req.params);
  urlDatabase[req.params.id] = req.body.update;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
<<<<<<< HEAD
  console.log('post / login')
  res.cookie('username', req.body.username);
=======
  const email = req.body.email;
  const password = req.body.password;
  const id = req.cookies.id;


if(!emailCheck(email)){
  res.status(403);
  res.send('Error 403 - Email not found');
} else if(!passwordTest(email, password)){
  res.status(403);
  res.send('Error 403 - Incorrect Password');
} else {
  res.cookie('id', users[user].id);
>>>>>>> register
  res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
<<<<<<< HEAD
  console.log("logout")
  res.clearCookie('username', req.body.username);
=======
  const id = req.cookies.id;
  res.clearCookie('id', users[id].id);
>>>>>>> register
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", (req, res) => {

  const randomID = randomStr();
  const email = req.body.email;
  const password = req.body.password;
  const emailFunc = emailCheck(email);

  if(emailCheck(email)){
    res.status(400);
    res.send('Error 400 - Email is already registered');
  }
   else if(email === '' || password === ''){
    res.status(400);
    res.send('Error 400 - Please submit email and/or password');
  }
  else {
  users[randomID] = {
    id: randomID,
    email: email,
    password: password
  };
  res.cookie('id', randomID);
  res.redirect("/urls");
  }
});

app.post("/register", (req, res) => {
  console.log('WE are on post /register');
})


app.listen(PORT, () => {
  console.log('connected to port', PORT);
});





