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
			const popularityPoints = getUserPopularityPoints(user);

			const userEmbed = new MessageEmbed({
				title: user.login,
				url: user.url,
				thumbnail: { url: user.avatar_url },
				fields: [
					{
						name: "Full name:",
						value: user.name
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
					},
					{
						name: "Pod:",
						value: user.pod
					},
					{
						name: "Popularity points:",
						value: popularityPoints
					}
				]
			})
				.setColor("#0099ff")
				.setFooter(
					"Project 0.2.1-fellowbook",
					"https://avatars.githubusercontent.com/mlh"
				);

			message.channel.send(userEmbed);
		}
	}
};

// mysterious formula!
const getUserPopularityPoints = user => {
	const date = new Date().getDate();
	const id = user.id.toString().slice(5);
	return parseInt(user.login.length + date * id) + user.followers || 0;
};

const getUserDataFromJSON = username => {
	const jsonData = fs.readFileSync(`./${username}.json`);
	return JSON.parse(jsonData);
};

// // TODO: Temporary - reserved for when AWS db is populated
// const getUserDataFromAPI = async username => {
// 	const response = await fetch(`https://api.github.com/users/${username}`);
// 	return response.json();
// };

const getUserDataFromAPI = async username => {
	const url =
		"https://a5c6y99l3g.execute-api.eu-central-1.amazonaws.com/devv/fellows/" +
		username;

	const response = await fetch(url, {
		headers: { Authorization: process.env.GITHUB_LOGIN_TOKEN }
	});
	return response.json();
};
