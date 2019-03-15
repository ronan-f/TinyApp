const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['5d41402abc4b2a76b9719d911017c592'],
}));

function randomStr() {
  let random = '';
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++)
    random += possible.charAt(Math.floor(Math.random() * possible.length));
  return random;
}

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "hello"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

app.use((req, res, next) => {
  app.locals.username = users[req.session.id];
  next();
})

function urlsForUser(id){
  urls = {};
  for (keys in urlDatabase){
    if (urlDatabase[keys].userID === id){
      urls[keys] = urlDatabase[keys].longURL;
    }
  } return(urls);
}

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
      return(users[user]['password'], pass );
    }
  } return false;
}

app.post("/urls", (req, res) => {
  const short = randomStr();
  urlDatabase[short] = {longURL: req.body.longURL, userID: req.session.id};
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
  let templateVars = { urls: urlsForUser(req.session.id),
                        ID: req.session.id
                      };

  if(req.session.id){
    res.render("urls_index", templateVars);
  } else {
    res.redirect('/login');
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
  let longURL = urlDatabase[shortURL].longURL;
  let templateVars = { shortURL: shortURL, longURL: longURL};

  if(req.session.id === urlDatabase[shortURL].userID){
    res.render("urls_show", templateVars);
  } else if(req.session.id){
    res.send('This URL does not belong to you!!!')
  } else {
    res.redirect("/login");
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  if(req.session.id === urlDatabase[shortURL].userID){
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else if(req.session.id){
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }

});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.update;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = req.session.id;

  console.log()


if(!emailCheck(email)){
  res.status(403);
  res.send('Error 403 - Email not found');
} else if(!passwordTest(email, password)){
  res.status(403);
  res.send('Error 403 - Incorrect Password');
} else {
  req.session.id = users[user].id;
  res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  const id = req.session.id;
  req.session.id = null;
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
  const hashedPass = bcrypt.hashSync(password, 10);
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
    password: hashedPass
  };
  req.session.id = randomID;
  res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log('connected to port', PORT);
});