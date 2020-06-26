const { POD_NICKNAME_TO_ID } = require("../../constants");

const isPodNickname = (userInput) => {
	const requestedNicknameSnippet = userInput.toLowerCase().substring(0, 3);

	for (pod of POD_NICKNAME_TO_ID) {
		if (pod.nickname.toLowerCase().includes(requestedNicknameSnippet)) {
			return pod.number;
		}
	}

	return null;
};

module.exports = isPodNickname;
