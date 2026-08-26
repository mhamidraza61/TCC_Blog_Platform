const jwt = require("jsonwebtoken");

// Creates a signed token containing the user's ID. The token expires in
// 30 days — after that, the user has to log in again.
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
