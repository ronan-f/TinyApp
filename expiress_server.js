const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const functions = require("./functions");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['5d41402abc4b2a76b9719d911017c592'],
}));

app.use((req, res, next) => {
  app.locals.username = functions.users[req.session.id];
  next();
})

app.post("/urls", (req, res) => {
  const short = functions.randomString();
  functions.urlDatabase[short] = {longURL: req.body.longURL, userID: req.session.id};
  res.redirect('/urls/' + short);
});

app.get("/", (req, res) => {
  if(req.session.id){
    res.redirect("/urls"); //if logged in send to /urls
  } else {
  res.redirect("/login");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(functions.urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: functions.urlsForUser(req.session.id),
    ID: req.session.id
  };
  if(req.session.id){
    res.render("urls_index", templateVars);
  } else {
    res.render("notLoggedIn");
  }
});

app.get("/urls/new", (req, res) => {
  if(req.session.id){
    res.render("urls_new");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  for(keys in functions.urlDatabase){ //check if shortURL exists in database. If not send error message
    if(shortURL === keys){
      found = true;
      let longURL = functions.urlDatabase[shortURL].longURL;
      let templateVars = { shortURL: shortURL, longURL: longURL};
      if(req.session.id === functions.urlDatabase[shortURL].userID){
      return res.render("urls_show", templateVars);

      } else if(req.session.id){
        return res.render('urlNotYours')
      } else {
        return res.render("notLoggedIn");
      }
    }
  }

    res.render("urlNotFound");

});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  for(keys in functions.urlDatabase){
    if (shortURL === keys){
      const longURL = functions.urlDatabase[req.params.shortURL].longURL;
      res.redirect(longURL);
    }
  } res.render("urlNotFound");

});

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  if(req.session.id === functions.urlDatabase[shortURL].userID){ //check if cookies matches the ID in user database
    delete functions.urlDatabase[shortURL];
    res.redirect("/urls");
  } else if(req.session.id){
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.post("/urls/:id", (req, res) => {
  functions.urlDatabase[req.params.id]['longURL'] = req.body.update;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = req.session.id;

if(!functions.emailCheck(email)){
  res.status(403);
  res.render('error403');
} else if(!functions.passwordTest(email, password)){
  res.status(403);
  res.render('error403');
} else {
  req.session.id = functions.users[user].id;
  res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  const id = req.session.id;
  req.session = null;
  res.redirect("/login");
});

app.get("/register", (req, res) => {
  if(req.session.id){
    res.redirect("/urls");
  } else {
    res.render("register");
  }

});

app.get("/login", (req, res) => {
  if(req.session.id){
    res.redirect("/urls");
  }else{
  res.render("login");
  }
});

app.post("/register", (req, res) => {

  const randomID = functions.randomString();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPass = bcrypt.hashSync(password, 10);
  const emailFunc = functions.emailCheck(email);

  if(functions.emailCheck(email)){
    res.status(400);
    res.render('registerFail');
  }
   else if(email === '' || password === ''){
    res.status(400);
    res.render('registerFail');
  }
  else {
  functions.users[randomID] = {
    id: randomID,
    email: email,
    password: hashedPass
  };
  req.session.id = randomID;
  res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log('connected to port', PORT);
});