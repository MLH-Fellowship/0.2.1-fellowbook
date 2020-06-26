const { LIST_OF_PROJECTS } = require("../../constants");

/**Returns an array containing a boolean for whether the command argument roughly matches a project and, if so, the project name.*/
const isProject = (message, userInput) => {
	if (isAmbiguousSci(userInput)) {
		message.channel.send("That may refer to Scikit-Learn or SciML.");
		return;
	}

	const requestedProjectSnippet = isSci
		? userInput.toLowerCase().substring(0, 4)
		: userInput.toLowerCase().substring(0, 3);

	for (project of LIST_OF_PROJECTS) {
		if (project.toLowerCase().includes(requestedProjectSnippet)) {
			return project;
		}
	}

	return null;
};

const isAmbiguousSci = (requestedProject) =>
	isSci(requestedProject) && requestedProject.length <= 3;

const isSci = (requestedProject) =>
	requestedProject.toLowerCase().startsWith("sci");

module.exports = isProject;
