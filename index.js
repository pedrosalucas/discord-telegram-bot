require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const TelegramBot = require('node-telegram-bot-api');

// Set Telegram Bot
const TOKEN_TELEGRAM = process.env.TOKEN_TELEGRAM;
const botTelegram = new TelegramBot(TOKEN_TELEGRAM, { polling: true });
const setToken = require('./commandsTelegram/setToken');
const messageToDiscord = require('./sendMessage/messageToDiscord');
// Set Discord Bot
const PREFIX = process.env.PREFIX;
const TOKEN_DISCORD = process.env.TOKEN_DISCORD;
const botDiscord = new Discord.Client();
const messageToTelegram = require('./sendMessage/messageToTelegram');

botDiscord.commands = new Discord.Collection();
const commandFilesDiscord = fs.readdirSync('./commandsDiscord').filter(file => file.endsWith('.js'));
for (const file of commandFilesDiscord) {
	const command = require(`./commandsDiscord/${file}`);
	botDiscord.commands.set(command.name, command);
}

// Discord Bot
botDiscord.login(TOKEN_DISCORD);

botDiscord.on('message', (message) => {
	if (message.author.bot) return;

	if (message.content.startsWith(PREFIX)) {
		const args = message.content.slice(PREFIX.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();

		try {
			botDiscord.commands.get(command).execute(botDiscord, message);
		} catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
		}
	} else if (message.channel.name === 'telegram-group') {
		messageToTelegram.execute(botTelegram, message);
	}
});

// Telegram Bot
botTelegram.on('message', (msg) => {

	try {
		if (msg.text.startsWith(PREFIX)) {
			const chatId = msg.chat.id;
			const args = msg.text.slice(PREFIX.length).trim().split(/ +/);
			const command = args.shift().toLowerCase();

			switch (command) {
			case 'settoken':
				// args == token
				botTelegram.sendMessage(chatId, 'Setting Token...');
				setToken.execute(botTelegram, msg, chatId, args[0]);
				break;
			case 'help':
				botTelegram.sendMessage(chatId, 'Essa vai ser uma mensagem de ajuda : )');
				break;
			default:
				botTelegram.sendMessage(chatId, 'Esse comando ainda não tenho 😔\nDigite "%help" para ter uma lista dos comandos aceitos.');
				break;
			}
		} else {
			messageToDiscord.execute(botDiscord, msg, msg.chat.id);
		}
	} catch (error) {
		console.error(error);
	}
});