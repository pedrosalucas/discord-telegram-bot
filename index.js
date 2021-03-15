// Discord Bot
const fs = require('fs');
require('dotenv').config();
const Discord = require('discord.js');
const botDiscord = new Discord.Client();
botDiscord.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	botDiscord.commands.set(command.name, command);
}

const PREFIX = process.env.PREFIX;
const TOKEN_DISCORD = process.env.TOKEN_DISCORD;

botDiscord.login(TOKEN_DISCORD);

botDiscord.on('ready', () => {
	console.info(`Logged in as ${botDiscord.user.tag}!`);
});

botDiscord.on('message', (message) => {
	if (message.author.bot) return;

	if (message.content.startsWith(PREFIX)) {
		const args = message.content.slice(PREFIX.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();

		try {
			botDiscord.commands.get(command).execute(message);
		} catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
		}
	} else if (message.channel.name === 'telegram-group') {
		message.channel.send(message.content);
	}
});


// Telegram Bot
const TelegramBot = require('node-telegram-bot-api');

const TOKEN_TELEGRAM = process.env.TOKEN_TELEGRAM;
const botTelegram = new TelegramBot(TOKEN_TELEGRAM, { polling: true });

botTelegram.onText(/%help/, (msg) => {
	const chatId = msg.chat.id;
	const resp = 'Essa vai ser uma mensagem de ajuda. : )';

	botTelegram.sendMessage(chatId, resp);
});

botTelegram.on('message', (msg) => {
	const chatId = msg.chat.id;

	botTelegram.sendMessage(chatId, `You sent "${msg}".`);

});