const { discordToken } = require("./config");
const client = require("./Client");

client.once("ready", () => console.log("Client ready!"));
client.login(discordToken);

client.on("message", (message) => {
	if (!message.content.startsWith("!") || message.author.bot) return;

	const args = message.content.slice(1).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		message.channel.send("There was an error trying to execute that command!");
	}
});
