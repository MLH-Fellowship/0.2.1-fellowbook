const { GOOD_BOT_REACTIONS } = require("../constants");

module.exports = {
  name: "goodbot",
  description: "Reacts to petting",
  async execute(message, args) {
    const reaction =
      GOOD_BOT_REACTIONS[Math.floor(Math.random() * GOOD_BOT_REACTIONS.length)];
    message.channel.send(reaction);
  },
};
