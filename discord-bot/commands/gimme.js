const { MessageEmbed } = require("discord.js");
const { PLAYLIST_URL, MESSAGE_EMBED_FOOTER } = require("../constants");
const isProject = require("./utils/isProject");
const displayMentors = require("./utils/displayMentors");
const displayProject = require("./utils/displayProject");
const displayFellow = require("./utils/displayFellow");

module.exports = {
	name: "gimme",
	description:
		"Fetches data on fellows, mentors, projects or playlist and returns it as an embed",
	async execute(message, args) {
		arg = args.length > 1 ? args.join(" ") : args[0];

		try {
			if (isMentors(arg)) {
				displayMentors(message);
				return;
			}

			if (arg.toLowerCase() === "playlist") {
				displayPlaylist(message);
				return;
			}

			const project = isProject(message, arg);
			if (project) {
				displayProject(message, project);
				return;
			}

			await displayFellow(message, arg);
		} catch (error) {
			message.channel.send(`Nope, ${arg} doesn't ring a bell.`);
		}
	},
};

const isMentors = (userInput) => userInput.toLowerCase() === "mentors";

const displayPlaylist = (message) => {
	const embed = new MessageEmbed({
		title: "Playlist",
		color: "#0099ff",
		thumbnail: { url: "https://avatars.githubusercontent.com/mlh" },
		fields: [
			{
				name: "MLH Fellowship Sessions",
				value: `[YouTube URL](${PLAYLIST_URL})`,
			},
		],
		footer: MESSAGE_EMBED_FOOTER,
	});

	message.channel.send(embed);
};
