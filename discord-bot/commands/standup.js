const { MessageEmbed } = require("discord.js");
const { API_BASE_URL, MESSAGE_EMBED_FOOTER } = require("../constants");
const fetch = require("node-fetch");
const { githubToken } = require("../config");
const isPodNickname = require("./utils/isPodNickname");

module.exports = {
	name: "standup",
	description: "Fetches user standup data and returns it as an embed",
	async execute(message, args) {
		const arg = validateArgs(args, message);

		if (isPodNumber(arg)) {
			displayEntirePodStandups(arg, message);
		} else if (isPodNickname(arg)) {
			const podNumber = isPodNickname(arg);
			displayEntirePodStandups(podNumber, message);
		} else {
			displaySingleUserStandup(arg, message);
		}
	},
};

const validateArgs = (args, message) => {
	if (args.length === 0) {
		message.channel.send(
			"No argument! :grimacing:\nUsage: `!standup [githubUsername]`"
		);
		return;
	} else if (args.length > 1) {
		message.channel.send(
			"Too many arguments! :grimacing:\nUsage: `!standup [githubUsername]`"
		);
		return;
	}
	return args[0];
};

const isPodNumber = (string) => /^\d\.\d\.\d$/.test(string);

const displaySingleUserStandup = async (username, message) => {
	const standupData = await getStandupData({ type: "user", arg: username });

	if (
		standupData.error ||
		(standupData.message && standupData.message === "Internal server error")
	) {
		message.channel.send(
			"Hmm, either that GitHub username is not a fellow, or that fellow did not write down their standup."
		);
		return;
	}

	const userPicture = await getUserPictureUrl(username);

	message.channel.send(createUserStandupEmbed(standupData, userPicture));
};

const displayEntirePodStandups = async (podId, message) => {
	const standupData = await getStandupData({ type: "pod", arg: podId });

	if (standupData.message && standupData.message === "Internal server error") {
		message.channel.send("Hmm, that doesn't seem to be a valid pod number.");
		return;
	}

	for (let userStandupData of standupData) {
		const userPicture = await getUserPictureUrl(userStandupData.username);
		message.channel.send(createUserStandupEmbed(userStandupData, userPicture));
	}
};

const getStandupData = async ({ type, arg }) => {
	const endpoint = API_BASE_URL + "/standups?" + type + "=" + arg;

	const response = await fetch(endpoint, {
		headers: { Authorization: githubToken },
	});
	return response.json();
};

const getUserPictureUrl = async (username) => {
	const endpoint = API_BASE_URL + "/fellows/" + username;

	const response = await fetch(endpoint, {
		headers: { Authorization: githubToken },
	});
	const jsonData = await response.json();
	return jsonData.avatar_url;
};

const createUserStandupEmbed = (standupData, userPictureUrl) => {
	return new MessageEmbed({
		title: "Standup for " + standupData.username,
		url: standupData.url,
		description: processStandupContent(standupData.body),
		thumbnail: { url: userPictureUrl },
		footer: MESSAGE_EMBED_FOOTER,
		color: "#0099ff",
	});
};

const processStandupContent = (content) => {
	const hasLinkSnippets = /<a(.*)<\/a>/.test(content);

	if (hasLinkSnippets) {
		content = processLinkSnippets(content);
	}

	return content
		.replace(/<(\/)?p>/g, "")
		.replace(/<(\/)?pre>/g, "")
		.replace(/<(\/)?code>/g, "")
		.replace(/<(\/)?strong>/g, "**")
		.replace(/<(\/)?ul>/g, "")
		.replace(/<(\/)?code>/g, "`")
		.replace(/<(\/)?em>/g, "_")
		.replace(/<br>/g, "")
		.replace(/<(\/)?del>/g, "~~")
		.replace(/<li>/g, "• ")
		.replace(/<\/li>/g, "")
		.replace(/\n{2,}\*/g, "\n\n*") // remove extra whitespace before headers
		.replace(/(?!\w)\n{2,}•/g, "\n•") // remove extra whitespace in between bullet points
		.replace(/• \n/g, "• ")
		.replace(/<(\/)?h2>/g, "")
		.replace(/<g-emoji(.*?)<\/g-emoji>/g, "");
};

const processLinkSnippets = (content) => {
	const linkSnippets = content.match(/<a(.*?)<\/a>/g); // `?` → non-greedy for consecutive links

	for (let linkSnippet of linkSnippets) {
		try {
			content = content.replace(linkSnippet, buildDicordLink(linkSnippet));
		} catch (error) {
			continue;
		}
	}

	return content;
};

const buildDicordLink = (snippet) => {
	const isUsername = /@/.test(snippet);
	if (isUsername) {
		const match = snippet.match(/<a(.*?)href="(.*?)">(@.*?)<\/a>/);
		const linkUrl = decodeURI(match[2]);
		const username = match[3];
		return `[${username}](${linkUrl})`;
	}

	// image
	const isImage = /<img/.test(snippet);
	if (isImage) {
		return "";
	}

	// bare link or link with text
	const match = snippet.match(/<a href="(.*?)"(.*?)>(.*?)<\/a>/);
	const linkUrl = decodeURI(match[1]);
	const linkText = match[3];

	if (linkText === "") {
		return linkUrl;
	} else {
		return `[${linkText}](${linkUrl})`;
	}
};
