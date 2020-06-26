const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const { API_BASE_URL, MESSAGE_EMBED_FOOTER } = require("../constants");
const { githubToken } = require("../config");

module.exports = {
	name: "random",
	description:
		"Randomizes pod member list (with arg) or picks fellow at random (no arg)",
	async execute(message, args) {
		const hasPlainFlag = args.length === 2 && args[1] === "--plain";

		try {
			if (args.length === 0) {
				const randomFellowData = await getRandomFellow();
				message.channel.send("Here's a random fellow for you:");
				message.channel.send(createRandomFellowEmbed(randomFellowData));
			} else if (args.length === 1 || (args.length === 2 && hasPlainFlag)) {
				message.channel.send(
					createRandomizedPodReply({
						randomizedPodData: await getRandomizedPodMembers(args[0]),
						plain: hasPlainFlag,
					})
				);
			} else {
				message.channel.send(
					`Too many arguments! :grimacing:\n
          Usage:\n
          - Random fellow: \`!random\`\n
          - Random list: \`!random [pod name]\`\n
          - Random list: \`!random [pod number]\`\n
          - For the random list, add a \`--plain\` flag to get it in plaintext.`
				);
				return;
			}
		} catch (error) {
			message.channel.send("Uh oh, randomization failed miserably.");
		}
	},
};

// ----------
// !random
// ----------

const getRandomFellow = async () => {
	const endpoint = API_BASE_URL + "/random";

	const response = await fetch(endpoint, {
		headers: { Authorization: githubToken },
	});
	return response.json();
};

const createRandomFellowEmbed = (randomFellowData) => {
	return new MessageEmbed({
		title: randomFellowData.name,
		url: randomFellowData.html_url,
		thumbnail: { url: randomFellowData.avatar_url },
		fields: createRandomFellowEmbedFields(randomFellowData),
		footer: MESSAGE_EMBED_FOOTER,
		color: "#0099ff",
	});
};

const createRandomFellowEmbedFields = (randomFellowData) => {
	let embedFields = [];

	const isFellow =
		randomFellowData.pod !== "MLH Staff" &&
		randomFellowData.pod !== "Mentors" &&
		randomFellowData.pod !== "CTF";
	const hasBio = randomFellowData.bio !== null && randomFellowData.bio !== "";
	const hasLocation =
		randomFellowData.location !== null && randomFellowData.location !== "";

	embedFields.push({
		name: getGroupType(randomFellowData.pod),
		value: isFellow
			? randomFellowData.pod_id + " " + randomFellowData.pod
			: randomFellowData.pod,
	});

	if (hasBio) {
		embedFields.push({
			name: "Bio:",
			value: randomFellowData.bio,
		});
	}

	if (hasLocation) {
		embedFields.push({
			name: "Location:",
			value: randomFellowData.location,
		});
	}

	return embedFields;
};

const getGroupType = (groupType) => {
	if (groupType === "MLH Staff" || groupType === "Mentors") return "Group:";
	return "Pod:";
};

// -----------------------
// !random [pod number]
// -----------------------

const getRandomizedPodMembers = async (input) => {
	const endpoint = API_BASE_URL + "/random" + "?query=" + input;

	const response = await fetch(endpoint, {
		headers: { Authorization: githubToken },
	});
	return response.json();
};

const createRandomizedPodReply = ({ randomizedPodData, plain }) => {
	return plain
		? createRandomizedPodPlainMessage(randomizedPodData)
		: createRandomizedPodEmbed(randomizedPodData);
};

const createRandomizedPodPlainMessage = (randomizedPodData) => {
	const isFellowGroup =
		randomizedPodData[0].pod !== "MLH Staff" &&
		randomizedPodData[0].pod !== "Mentors";
	const fellowGroupLabel = `**Pod ${randomizedPodData[0].pod_id} ${randomizedPodData[0].pod}**`;
	const genericGroupLabel = `**${randomizedPodData[0].pod_id}**`;

	let message = "Here's a random list of members for:\n";
	message += isFellowGroup ? fellowGroupLabel : genericGroupLabel;
	message += "\n";

	for (let i = 0; i < randomizedPodData.length; i++) {
		const member = randomizedPodData[i];
		message += `${i + 1}. **${member.name || member.username}**\n`;
	}

	return message;
};

const createRandomizedPodEmbed = (randomizedPodData) => {
	let description = createRandomizedPodEmbedMessage(randomizedPodData);
	description += createRandomizedPodEmbedTable(randomizedPodData);

	return new MessageEmbed({
		description,
		footer: MESSAGE_EMBED_FOOTER,
		color: "#0099ff",
	});
};

const createRandomizedPodEmbedMessage = (randomizedPodData) => {
	const isFellowGroup =
		randomizedPodData[0].pod !== "MLH Staff" &&
		randomizedPodData[0].pod !== "Mentors";
	const fellowGroupLabel = `**Pod ${randomizedPodData[0].pod_id} → ${randomizedPodData[0].pod}**`;
	const genericGroupLabel = `**${randomizedPodData[0].pod_id}**`;

	let message = "Here's a random list of members for:\n";
	message += isFellowGroup ? fellowGroupLabel : genericGroupLabel;
	message += "\n";

	return message;
};

const createRandomizedPodEmbedTable = (randomizedPodData) => {
	const names = randomizedPodData.map(
		(member) => member.name || member.username
	);
	const longestName = [...names].sort((a, b) => b.length - a.length)[0];
	const edgeLine = "═".repeat(longestName.length);
	const headerWhitespace = " ".repeat(longestName.length - "Name".length);

	let table = "";
	table += `\`\`\`\n╔═════╦═${edgeLine}═╗\n`; // top
	table += `║ No. ║ Name${headerWhitespace} ║\n`; // header content
	table += `╠═════╬═${edgeLine}═╣\n`; // header divider

	for (let i = 0; i < names.length; i++) {
		const name = names[i];
		const nameWhitespace = " ".repeat(longestName.length - name.length);
		const number = i + 1 < 10 ? " " + (i + 1) : i + 1;
		table += `║ ${number}  ║ ${name}${nameWhitespace} ║\n`;
	}

	table += `╚═════╩═${edgeLine}═╝\`\`\``; // bottom

	return table;
};
