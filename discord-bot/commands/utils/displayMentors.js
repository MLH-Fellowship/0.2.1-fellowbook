const { MessageEmbed } = require("discord.js");
const { MESSAGE_EMBED_FOOTER } = require("../../constants");

const displayMentors = (message) => {
	const embed = new MessageEmbed({
		description: createMentorsTable(),
		footer: MESSAGE_EMBED_FOOTER,
		color: "#0099ff",
	});

	message.channel.send(embed);
};

const createMentorsTable = () => {
	// https://plaintexttools.github.io/plain-text-table/
	return `
\`\`\`
╔════════════════╤═════════════════╤══════════╗
║     Mentor     │      Pods       │ Timezone ║
╟────────────────┼─────────────────┼──────────╢
║ Matthew Bunday │  0.0.1 + 0.0.2  │ GMT-4    ║
╟────────────────┼─────────────────┼──────────╢
║ Cory Massaro   │  0.1.1 + 0.1.2  │ GMT-7    ║
╟────────────────┼─────────────────┼──────────╢
║ Ian Jennings   │  0.2.1 + 0.2.2  │ GMT-5    ║
╟────────────────┼─────────────────┼──────────╢
║ Rohan Almeida  │  0.3.1 + 0.3.2  │ GMT+5:30 ║
╟────────────────┼─────────────────┼──────────╢
║ Jani Eväkallio │  0.4.1 + 0.4.2  │ GMT+1    ║
╟────────────────┼─────────────────┼──────────╢
║ Raymond Pasco  │  0.5.1 + 0.5.2  │ GMT-4    ║
╚════════════════╧═════════════════╧══════════╝\`\`\``;
};

module.exports = displayMentors;
