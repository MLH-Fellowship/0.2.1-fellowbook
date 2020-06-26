const { BAD_BOT_REACTIONS } = require("../constants");

module.exports = {
	name: "badbot",
	description: "Reacts to criticism",
	async execute(message, args) {
		const reaction =
			BAD_BOT_REACTIONS[Math.floor(Math.random() * BAD_BOT_REACTIONS.length)];
		message.channel.send(reaction);
	},
};
