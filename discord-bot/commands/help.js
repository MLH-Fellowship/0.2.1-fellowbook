module.exports = {
	name: "help",
	description: "Explains bot usage",
	async execute(message, args) {
		const helpMessage = `Your wish is my command:\n
    :robot: \`!gimme [GitHub username]\` to get a fellow, mentor or MLH admin
    \t\t → Example: \`!gimme yashkumarverma\`\n
    :robot: \`!gimme mentors\` to get a list of mentors\n
    :robot: \`!gimme playlist\` to get a link to the MLH Fellowship Sessions\n
    :robot: \`!gimme [project]\` to get a project
    \t\t → Example: \`!gimme amplify\`\n
    :robot: \`!random\` to get a random fellow\n
    :robot: \`!random [pod name]\` or \`!random [pod number]\` to get a randomized list of pod members
    \t\t → Example: \`!random dodos\` or \`!random 0.2.1\`
    \t\t → Example: \`!random Mentors\` or \`!random MLH Staff\`\n
    :robot: \`!standup [GitHub username]\` or \`!standup [pod number]\` to get their daily standup
    \t\t → Example: \`!standup michiboo\` or \`!standup 0.4.1\`\n
    :robot: \`!goodbot\` or \`!badbot\` to like or dislike the bot
    `;

		message.channel.send(helpMessage);
	},
};
