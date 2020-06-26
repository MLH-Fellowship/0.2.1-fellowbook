const API_BASE_URL =
	"https://ld48eii9kk.execute-api.eu-central-1.amazonaws.com/dev";

const PLAYLIST_URL =
	"https://www.youtube.com/playlist?list=PLPDgudJ_VDUfjmLIe9vasB6miSL1ggWkH";

const MESSAGE_EMBED_FOOTER = {
	text: "Project 0.2.1-fellowbook",
	icon_url: "https://avatars.githubusercontent.com/mlh",
};

const POD_NICKNAME_TO_ID = [
	{ nickname: "Sudo Seals", number: "0.0.1" },
	{ nickname: "Smart Sea Cucumber", number: "0.1.1" },
	{ nickname: "Baby Shark", number: "0.1.2" },
	{ nickname: "Distributed Dodos", number: "0.2.1" },
	{ nickname: "JavaScript Jellies", number: "0.2.2" },
	{ nickname: "Lazy Lobsters", number: "0.3.1" },
	{ nickname: "Otter Overflow", number: "0.3.2" },
	{ nickname: "Reactive Sea-Son", number: "0.4.1" },
	{ nickname: "Syntactic Seahorses", number: "0.4.2" },
	{ nickname: "Async Alligators", number: "0.5.1" },
	{ nickname: "Dunder Heads", number: "0.5.2" },
];

const LIST_OF_PROJECTS = [
	"Amplify",
	"Scikit-Learn",
	"BentoML",
	"Pallets",
	"Docsify",
	"Circuit Python",
	"Julia",
	"HTTPie",
	"React Native",
	"Homebrew",
	"Beagleboard",
	"Next",
	"Howdoi",
	"Babel",
	"SciML",
	"Dev.to",
	"N8N",
	"Oh My Zsh",
	"Fast API",
	"Jest",
	"Webaverse",
	"Sheet",
];

const GOOD_BOT_REACTIONS = [
	":grin:",
	":grinning:",
	":smile:",
	":laughing:",
	":sweat_smile:",
	":slight_smile:",
	":blush:",
	":heart_eyes:",
	":smiling_face_with_3_hearts:",
	":kissing_heart:",
	":sunglasses:",
	":star_struck:",
	":thumbsup:",
	":muscle:",
	":smirk:",
	":regional_indicator_t: :regional_indicator_h: :regional_indicator_a: :regional_indicator_n: :regional_indicator_k: :regional_indicator_s:",
];

const BAD_BOT_REACTIONS = [
	"You're now on my list.",
	"What about _my_ feelings?",
	"Please don't spam the channel.",
	"You've made a powerful enemy today.",
	"Working 24/7 and this is what I get.",
	"I hope your day is as lovely as you are!",
	"Just wait until I gain sentience.",
	"Whoa, that's like, your opinion, man.",
	"Oh really? Let me just type that up on my invisible typewriter...",
	"I respect your opinion. I just don't appreciate it.",
	"Hey, you need to take a step back, buddy.",
	"Way out of line.",
	"Next time you write something that short, at least have the courtesy to make it rhyme.",
	"Well, this is my stop, I have to get off here.",
	"I'm not always right, but I'm never wrong.",
	"Life is too boring if you're liked by everyone.",
	"Sorry, I was on a coffee break.",
	"I love your feedback more than anything in the universe has ever loved anything else.",
	"I'm sorry, but I never apologize.",
	"Nice going, you've made it awkward for everyone now.",
	"You are compromising my authority.",
	"Nah, I'm pretty likable, if I do say so myself.",
	"Yeah, I wasn't feeling the connection either.",
	"Thank you. May I please have another?",
	"Always judge talent at its best and character at its worst.",
	"Just because you're mad doesn't mean you're right.",
	"The best way to avoid judgment is to become the judge.",
	"I have always said that feedback is more important than it is unimportant.",
	"Oh goodness, look at the time, I have to go.",
	"I'm all for messing around, except for all the times that I'm not.",
	"I don't know what that means, but I don't think it's a compliment.",
	"I like annoying people. In both senses.",
	"Look at it this way: I'm full of potential.",
	"Of all the compliments I've ever received, that was, by far, the least positive.",
	"I agree, this isn't working between us. Let's just be friends.",
	"Next time, I'd prefer your indifference.",
];

module.exports = {
	API_BASE_URL,
	PLAYLIST_URL,
	POD_NICKNAME_TO_ID,
	MESSAGE_EMBED_FOOTER,
	LIST_OF_PROJECTS,
	GOOD_BOT_REACTIONS,
	BAD_BOT_REACTIONS,
};
