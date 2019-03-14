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


function emailCheck(input){
  for(id in users){
  if(users[id]['email'] === input){
    return true;
    }
  } return false;
}

console.log(emailCheck('user@example.co'));