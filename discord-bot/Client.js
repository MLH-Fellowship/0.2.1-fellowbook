const fs = require("fs");
const { Client, Collection } = require("discord.js");

const client = new Client();

client.initializeCommands = () => {
  client.commands = new Collection();
  const commandFiles = fs
    .readdirSync("./commands")
    .filter(file => file.endsWith(".js"));

  for (let file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
};

client.initializeCommands();

module.exports = client;
