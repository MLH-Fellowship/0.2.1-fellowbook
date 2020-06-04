const fetch = require("node-fetch");
const MLH_FELLOWSHIP_ORG_ID = 65834464;

const getUserDetails = async (token) => {
    const response = await fetch(
        'https://api.github.com/user',
        { headers: { authorization: "token " + token } }
    );
    return response.json();
}

const isUserInMlhOrg = async (url, token) => {
    const response = await fetch(
        url,
        { headers: { authorization: "token " + token } }
    );

    const json = await response.json();
    if (json.find(org => org.id === MLH_FELLOWSHIP_ORG_ID)) {
        return true;
    } else {
        return false;
    }
};

// Note: ideally, we just do /user/orgs, but that isn't working for me for some reason
// so instead, we do /user to basically ensure we have the authenticated username
// and check the username's organisations. Convoluted, but seems to work!
const isValidUser = async (token) => {
    const userDetails = await getUserDetails(token);
    return await isUserInMlhOrg(userDetails.organizations_url, token);
}

exports.handler = async (event, context, callback) => {
    console.log(event);
    const token = event.authorizationToken;
    if (await isValidUser(token)) {
        callback(null, generatePolicy('user', 'Allow', event.methodArn));
    } else {
        callback(null, generatePolicy('user', 'Deny', event.methodArn));
    }
};

// Help function to generate an IAM policy
var generatePolicy = function (principalId, effect, resource) {
    var authResponse = {};

    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }

    return authResponse;
}
