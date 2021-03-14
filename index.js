const fs = require('fs');
require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

const PREFIX = process.env.PREFIX;
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
	console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', (message) => {
	if (message.author.bot) return;

	if (message.content.startsWith(PREFIX)) {
		const args = message.content.slice(PREFIX.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();

		try {
			bot.commands.get(command).execute(message);
		} catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
		}
	} else if (message.channel.name === 'telegram-group') {
		message.channel.send(message.content);
	}
});
