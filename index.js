require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const TelegramBot = require('node-telegram-bot-api');

// Set Telegram Bot
const TOKEN_TELEGRAM = process.env.TOKEN_TELEGRAM;
const botTelegram = new TelegramBot(TOKEN_TELEGRAM, { polling: true });
// Set Discord Bot
const botDiscord = new Discord.Client();
botDiscord.commands = new Discord.Collection();

// Discord Bot
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	botDiscord.commands.set(command.name, command);
}

const PREFIX = process.env.PREFIX;
const TOKEN_DISCORD = process.env.TOKEN_DISCORD;
botDiscord.login(TOKEN_DISCORD);

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
		// Falta id do chat do Telegram Dinamico
		const ID_TELEGRAM_CHAT = process.env.ID_TELEGRAM_CHAT;
		botTelegram.sendMessage(ID_TELEGRAM_CHAT, '-----------------------------------');
		botTelegram.sendMessage(ID_TELEGRAM_CHAT, `Autor: ${message.author.username}#${message.author.discriminator}\n\nContent: ${message.content}`);
		botTelegram.sendMessage(ID_TELEGRAM_CHAT, '-----------------------------------');
	}
});

// Telegram Bot
botTelegram.on('message', (msg) => {

	try {
		if (msg.text === '%help') {
			const chatId = msg.chat.id;
			console.log(chatId);
			const resp = 'Essa vai ser uma mensagem de ajuda : )';
			botTelegram.sendMessage(chatId, resp);
		} else {
			// Falta id do chat do Discord Dinamico
			const ID_DISCORD_CHAT = process.env.ID_DISCORD_CHAT;
			const channelDiscordTest = botDiscord.channels.cache.get(ID_DISCORD_CHAT);
			channelDiscordTest.send('-----------------------------------');
			channelDiscordTest.send(`Autor: ${msg.from.first_name} ${msg.from.last_name}\n\nContent: ${msg.text}`);
			channelDiscordTest.send('-----------------------------------');
		}
	} catch (error) {
		console.error(error);
	}

	// botTelegram.sendMessage(chatId, `You sent "${msg.text}".`);
});