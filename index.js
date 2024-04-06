import { parse } from 'url';
import { json, send } from 'micro';
import TelegramBot from 'node-telegram-bot-api';

const token = "7106683591:AAFhWQQ2eVLbRlomWOlLRpcvI7eOx7DZ2Xo";
const bot = new TelegramBot(token, { polling: false }); 

function decodeMsg(text) {
    const cleanedText = text.replace(/\n/g, '');
    const regex = /Currency pair\s*([\w/]+)\s*.*put\s*["']?(UP|DOWN)["']?/i;

    const match = cleanedText.match(regex);
    if (match) {
        const currencyPair = match[1]; // EUR/USD
        const putOption = match[2];    // UP or DOWN
        return `Currency Pair: ${currencyPair} \n Put Option: ${putOption}`;
    } else {
        return "No match found.";
    }
}

async function handleRequest(req, res) {
    const { pathname } = parse(req.url);

    if (pathname === '/webhook') {
        const body = await json(req);
        bot.processUpdate(body);

        // Extract the message from the update
        const message = body.message || body.edited_message;
        if (message) {
            const chatId = message.chat.id;
            const userInput = message.caption || message.text;
            const signal = decodeMsg(userInput);
            bot.sendMessage(chatId, signal);
        }

        send(res, 200, 'OK');
    } else {
        send(res, 404, 'Not found');
    }
}
export default handleRequest;

