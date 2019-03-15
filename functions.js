const bcrypt = require('bcrypt');

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2b$10$wk.c0CZlyyOWdRaEo1FUCOArEgPRTFwjRJBk0ri7lmfF7m/JAuBvi"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2b$10$wk.c0CZlyyOWdRaEo1FUCOArEgPRTFwjRJBk0ri7lmfF7m/JAuBvi"
  }
};

exports.urlDatabase = urlDatabase;
exports.users = users;

exports.randomString = function () {
  let random = '';
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++)
    random += possible.charAt(Math.floor(Math.random() * possible.length));
  return random;
}

exports.urlsForUser = function (id){
  urls = {};
  for (keys in urlDatabase){
    if (urlDatabase[keys].userID === id){
      urls[keys] = urlDatabase[keys].longURL;
    }
  } return(urls);
}

exports.emailCheck = function (input){
  for(id in users){
  if(users[id]['email'] === input){
    return true;
    }
  } return false;
}

exports.passwordTest = function (email, pass){
  for(user in users){
    if(users[user]['email'] === email && bcrypt.compareSync(pass, users[user]['password'])){
      return true;
    }
  } return false;
}