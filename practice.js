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


function passwordTest(email, pass){
  for(user in users){
    if(users[user]['email'] === email){
      return(users[user]['password'] === pass)
    }
  } return false;
}

console.log(passwordTest('user2@exampl.com', 'dishwasher-funk'));