const fs = require("fs");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "gimme",
	description:
		"Requests user data from db at AWS Amplify and returns it in a Discord Embed Preview",
	async execute(message, args) {
		for (let username of args) {
			const user = await getUserDataFromJSON(username);

			const userEmbed = new MessageEmbed({
				title: user.login,
				url: user.url,
				thumbnail: { url: user.avatar_url },
				fields: [
					{
						name: "Full name:",
						value: user.name,
						inline: true
					},
					{
						name: "Public repos:",
						value: user.public_repos,
						inline: true
					},
					{
						name: "Followers:",
						value: user.followers,
						inline: true
					},
					{
						name: "Bio:",
						value: user.bio
					},
					{
						name: "Location:",
						value: user.location
					}
				]
			});

			message.channel.send(userEmbed);
		}
	}
};

const getUserDataFromAWS = username => {
	const jsonData = fs.readFileSync(`./${username}.json`);
	return JSON.parse(jsonData);
};

// TODO: dummy version, to be replaced with `getUserDataFromAWS`
const getUserDataFromJSON = async username => {
	const response = await fetch(`https://api.github.com/users/${username}`);
	return response.json();
};
