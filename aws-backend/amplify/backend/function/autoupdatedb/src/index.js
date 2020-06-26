const fetch = require("node-fetch");
const query = `
{
  organization(login: "MLH-Fellowship") {
    teams(first: 50) {
      edges {
        node {
          description
          name
          id
          members {
            nodes {
              avatarUrl
              bio
              email
              followers {
                totalCount
              }
              following {
                totalCount
              }
              location
              login
              name
              twitterUsername
              url
              websiteUrl
              company
            }
          }
        }
      }
    }
  }
}`;

const getPodName = (name, description) => {
  // 'name' is ID; 'description' is name
  if (name.startsWith('Pod')) {
    return description === '' ? name : description;
  } else {
    return name;
  }
};

const fetchUsers = async () => {
  const response = await fetch(
    'https://api.github.com/graphql',
    {
      method: 'post',
      headers: {
        Authorization: "bearer " + process.env.GITHUB_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    },
  );
  const json = await response.json();
  const teams = json.data.organization.teams.edges;

  const users = [];
  teams.forEach(obj => {
    team = obj.node;

    // Skip the parent teams; CTF would include people in other pods, so ignore that too
    if (['TTP Fellows (Summer 2020)', 'CTF', 'MLH Fellows (Summer 2020)'].includes(team.name)) return;

    const members = team.members.nodes;
    members.forEach(user => {
      users.push({
        avatar_url: user.avatarUrl,
        bio: user.bio,
        email: user.email,
        followers: user.followers.totalCount,
        following: user.following.totalCount,
        location: user.location,
        username: user.login.toLowerCase(),
        username_original: user.login,
        name: user.name,
        twitter_username: user.twitterUsername,
        github_url: user.url,
        website_url: user.websiteUrl,
        company: user.company,
        pod: getPodName(team.name, team.description),
        pod_id: team.name.replace('Pod ', ''),
      });
    });
  });

  return users;
}

const uploadUsers = async (users) => {
  const usersCount = users.length;

  // Batch of 20s, avoid API timeouts
  for (let i = 0; i < usersCount; i += 20) {
    const response = await fetch(
      // NOTE: this is a bit hacky, but we want to use the PUT request to insert ALL the users.
      // This saves us from calling the API authorizer function for EVERY fellow, which might lead to
      // GitHub API rate limiting for lots of consecutive calls
      // For this endpoint, we're going to ignore the username in the URL, and just use the username
      // from the body.
      `https://ld48eii9kk.execute-api.eu-central-1.amazonaws.com/dev/fellows/randomfellowthatdoesnotexist`,
      {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.GITHUB_TOKEN
        },
        body: JSON.stringify(users.slice(i, i + 20)),
      },
    );

    const json = await response.json();
    console.error('response', response, json);
  }
};

exports.handler = async (event, context, callback) => {
  await fetchUsers().then(users => uploadUsers(users));
};
