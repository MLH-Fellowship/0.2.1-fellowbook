const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  githubToken: process.env.GITHUB_LOGIN_TOKEN,
  discordToken: process.env.HEROKU_DISCORD_TOKEN
};
