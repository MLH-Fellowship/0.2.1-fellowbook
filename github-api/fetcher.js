const fetch = require("node-fetch");
const fs = require("fs");
const dotenv = require("dotenv");
const prettyStringify = require("json-stringify-pretty-compact");

dotenv.config();

const getJsonResponse = async ({ page }) => {
	const response = await fetch(
		`https://api.github.com/orgs/MLH-Fellowship/members?page=${page}&per_page=100`,
		{ headers: { authorization: "token " + process.env.GITHUB_TOKEN } }
	);
	return response.json();
};

const fetchUsers = async () => {
	console.log("Retrieving MLH Fellowship users from GitGub API");

	let users = [];
	let currentPage = 1;

	console.log("here");

	// fetch 200 users, should be more than enough
	while (currentPage <= 2) {
		const jsonResponse = await getJsonResponse({ page: currentPage++ });
		users.push(...jsonResponse);
	}

	return new Promise((resolve, reject) => {
		resolve(users);
	});
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
