const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.send('Hello World!');
});

const port = 3000;
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
// replace the value below with the Telegram token you receive from @BotFather
const token = "7106683591:AAFhWQQ2eVLbRlomWOlLRpcvI7eOx7DZ2Xo";

function decodeMsg(text){
	const cleanedText = text.replace(/\n/g, '');
const regex = /Currency pair\s*([\w/]+)\s*.*put\s*["']?(UP|DOWN)["']?/i;

const match = cleanedText.match(regex);
	if (match) {
		const currencyPair = match[1]; // EUR/USD
		const putOption = match[2];    // UP or DOWN
		return`Currency Pair: +${currencyPair}+\n+Put Option: +${putOption}`;
	} else {
		return("No match found.");
	}

}

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
	const chatId = msg.chat.id;
	const userInput = msg.text||msg.caption;
	const signal=decodeMsg(msg.caption);
	bot.sendMessage(chatId,signal);

});
