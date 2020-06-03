const fetch = require("node-fetch");
const fs = require("fs");
const dotenv = require("dotenv");
const prettyStringify = require("json-stringify-pretty-compact");

dotenv.config();

const getTeams = async () => {
	// <100 teams so first page will do!
	const response = await fetch(
		`https://api.github.com/orgs/MLH-Fellowship/teams`,
		{ headers: { authorization: "token " + process.env.GITHUB_TOKEN } }
	);
	return response.json();
};

const getMembersForTeam = async ({ teamSlug }) => {
	// <100 members per team so first page will do!
	const response = await fetch(
		`https://api.github.com/orgs/MLH-Fellowship/teams/${teamSlug}/members`,
		{ headers: { authorization: "token " + process.env.GITHUB_TOKEN } }
	);
	return response.json();
};

const fetchUsers = async () => {
	console.log("Retrieving MLH Fellowship users from GitGub API");

	const teams = await getTeams();
	const teamsCount = teams.length;
	console.log(`Fetched ${teamsCount} teams`);

	const users = [];
	for (let i = 0; i < teamsCount; i++) {
		const team = teams[i];

		// Skip the parent Summer 2020 team
		if (team.name === 'Summer 2020') continue;

		const membersForTeam = await getMembersForTeam({ teamSlug: team.slug });
		membersForTeam.forEach(member => member.pod = team.name);
		users.push(...membersForTeam);
	}

	return new Promise((resolve, reject) => resolve(users));
};

const saveUsers = users => {
	// TODO: Upload user data into AWS Amplify instead of dumping it as JSON.

	// save all users a single big JSON file
	const allUsersString = prettyStringify(users, { indent: 2 });
	fs.writeFileSync("./allUsers.json", allUsersString, "utf8");
	console.log(`Saved ${users.length} users to ./allUsers.json`);

	// save username array, for querying single users for more info that is not provided by /orgs/MLH-Fellowship/
	let usernames = { data: [] };
	for (let user of users) usernames.data.push(user.login);
	const allUsernamesString = prettyStringify(usernames, { indent: 2 });
	fs.writeFileSync("./usernames.json", allUsernamesString, "utf8");
	console.log(`Saved ${users.length} users to ./usernames.json`);
};

fetchUsers().then(users => saveUsers(users));
