module.exports = {
	name: "help",
	description: "Clarifies bot usage",
	async execute(message, args) {
		message.channel.send(
			"Heya, type `!gimme [Github username]` to get details of a Fellow!"
		);
	}
};
