const fs = require("fs");
const path = require("path");
const { MessageEmbed } = require("discord.js");
const { MESSAGE_EMBED_FOOTER } = require("../../constants");

const displayProject = (message, args) => {
	const projectData = getProjectDataFromJSON(args);
	message.channel.send({
		files: getImageFiles(projectData),
		embed: createProjectEmbed(projectData),
	});
};

const getImageFiles = ({ language, project }) => {
	const langLogosDirPath = path.join(process.env.PWD, "logos", "lang-logos");
	const techLogosDirPath = path.join(process.env.PWD, "logos", "tech-logos");

	return [
		{
			attachment: path.join(langLogosDirPath, `${language}.png`),
			name: "lang.png", // name for referencing image inside embed
		},
		{
			attachment: path.join(techLogosDirPath, `${project}.png`),
			name: "tech.png", // name for referencing image inside embed
		},
	];
};

// TODO: Replace with API data retrieval.
const getProjectDataFromJSON = (requestedProject) => {
	const projectsPath = path.join(process.env.PWD, "tempData", "projects.json");
	const jsonData = JSON.parse(fs.readFileSync(projectsPath));

	for (let storedProject of Object.keys(jsonData)) {
		if (storedProject === requestedProject) {
			jsonData[storedProject].project = storedProject;
			return jsonData[storedProject];
		}
	}
};

const createProjectEmbed = (projectData) => {
	const maintainerSections = createMaintainerSections(projectData.maintainers);
	const fieldLabel =
		projectData.maintainers.length > 1 ? "Maintainers" : "Maintainer";

	return new MessageEmbed({
		color: getLanguageColor(projectData.language),
		author: {
			name: projectData.language,
			icon_url: "attachment://lang.png",
		},
		title: projectData.project,
		url: projectData.siteUrl,
		description: projectData.description + `\n\n**${fieldLabel}**:`,
		thumbnail: { url: "attachment://tech.png" },
		fields: maintainerSections,
		footer: MESSAGE_EMBED_FOOTER,
	});
};

const createMaintainerSections = (maintainersNames) => {
	let maintainerSections = [];

	const maintainers = getMaintainersDataFromJSON(maintainersNames);

	if (maintainers.length === 0) {
		maintainerSections.push({
			name: "Uh oh",
			value: "No data to display!",
		});
	}

	if (maintainers.length === 1) {
		const [maintainer] = maintainers;
		maintainerSections.push({
			name: "Name:",
			value: `[${maintainer.fullName}](${getLinkedInUrlFor(maintainer)})`,
		});
		maintainerSections.push({
			name: "GitHub:",
			value: `[${maintainer.githubUser}](${getGithubUrlFor(maintainer)})`,
		});
		return maintainerSections;
	}

	for (let maintainer of maintainers) {
		maintainerSections.push({
			name: "Name:",
			value: `[${maintainer.fullName}](${getLinkedInUrlFor(maintainer)})`,
			inline: true,
		});
	}

	// If the project has two maintainers, add an empty third column to prevent an incorrect line break.
	// Otherwise, `inline: true` will create one row of three cells and another row of one cell.
	if (maintainers.length === 2) {
		maintainerSections.push({
			name: "\u200B",
			value: "\u200B",
			inline: true,
		});
	}

	for (let maintainer of maintainers) {
		maintainerSections.push({
			name: "GitHub:",
			value: `[${maintainer.githubUser}](${getGithubUrlFor(maintainer)})`,
			inline: true,
		});
	}

	if (maintainers.length === 2) {
		maintainerSections.push({
			name: "\u200B",
			value: "\u200B",
			inline: true,
		});
	}

	return maintainerSections;
};

const getLinkedInUrlFor = (maintainer) =>
	"https://www.linkedin.com/in/" + maintainer.linkedinId;

const getGithubUrlFor = (maintainer) =>
	"https://github.com/" + maintainer.githubUser;

const getLanguageColor = (language) => {
	const mapping = {
		Python: "#3572A5",
		JavaScript: "#f1e05a",
		Julia: "#a270ba",
		Ruby: "#701516",
		C: "#555555",
		Shell: "#89e051",
	};
	return mapping[language];
};

// TODO: Replace with API data retrieval.
const getMaintainersDataFromJSON = (requestedMaintainers) => {
	const maintainersPath = path.join(
		process.env.PWD,
		"tempData",
		"maintainers.json"
	);
	const jsonData = JSON.parse(fs.readFileSync(maintainersPath));
	let results = [];

	for (let requestedMaintainer of requestedMaintainers) {
		for (let storedMaintainer of Object.keys(jsonData)) {
			if (storedMaintainer === requestedMaintainer) {
				jsonData[storedMaintainer].fullName = storedMaintainer;
				results.push(jsonData[storedMaintainer]);
			}
		}
	}
	return results;
};

module.exports = displayProject;
