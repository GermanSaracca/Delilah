require("dotenv").config()

const jwtSign = process.env.SECRET_TOKEN;


module.exports = jwtSign;