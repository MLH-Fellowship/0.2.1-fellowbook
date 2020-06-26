const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const { githubToken } = require("../../config");
const { API_BASE_URL, MESSAGE_EMBED_FOOTER } = require("../../constants");

const displayFellow = async (message, arg) => {
	const userData = await getUserDataFromAPI(arg);
	userData.popularityPoints = getPopularityPoints(userData);
	message.channel.send(createEmbed(userData));
};

const getUserDataFromAPI = async (username) => {
	const endpoint = API_BASE_URL + "/fellows/" + username;

	const response = await fetch(endpoint, {
		headers: { Authorization: githubToken },
	});
	return response.json();
};

const getPopularityPoints = ({ id, name, followers }) => {
	const date = new Date().getDate();
	const mystery = id.toString().slice(5);
	return parseInt(name.length + date * mystery) + followers || 0;
};

const createEmbed = (userData) => {
	return new MessageEmbed({
		title: userData.login,
		url: userData.url,
		thumbnail: { url: userData.avatar_url },
		fields: [
			{
				name: "Full name:",
				value: userData.name,
			},
			{
				name: "Public repos:",
				value: userData.repositories,
				inline: true,
			},
			{
				name: "Followers:",
				value: userData.followers,
				inline: true,
			},
			{
				name: "Bio:",
				value: userData.bio || "None provided",
			},
			{
				name: "Location:",
				value: userData.location || "None provided",
			},
			{
				name: getGroupName(userData.pod),
				value: userData.pod,
			},
			{
				name: "Popularity points:",
				value: userData.popularityPoints,
			},
		],
		footer: MESSAGE_EMBED_FOOTER,
		color: "#0099ff",
	});
};

const getGroupName = (groupType) => {
	if (
		groupType === "MLH Staff" ||
		groupType === "Mentors" ||
		groupType === "CTF"
	)
		return "Group:";
	return "Pod:";
};

module.exports = displayFellow;
