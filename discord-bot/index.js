const fs = require("fs");
const { Client, Collection } = require("discord.js");
const dotenv = require("dotenv");

const initializeCommands = () => {
	client.commands = new Collection();
	const commandFiles = fs
		.readdirSync("./commands")
		.filter(file => file.endsWith(".js"));

	for (let file of commandFiles) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
	}
};

const client = new Client();
initializeCommands();

client.once("ready", () => console.log("Client ready!"));

dotenv.config();
client.login(process.env.DISCORD_TOKEN);

client.on("message", message => {
	if (!message.content.startsWith("!") || message.author.bot) return;

	const args = message.content.slice(1).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply("There was an error trying to execute that command!");
	}
});
