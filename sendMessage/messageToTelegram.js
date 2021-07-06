const mongo = require('../mongo');
const discordChatSchema = require('../schemas/discord-guild-schema');

module.exports = {
	name: 'messageToTelegram',
	description: 'Send message from Discord to Telegram',
	async execute(botTelegram, message) {

		let result;

		await mongo().then(async (mongoose) => {
			try {
				result = await discordChatSchema.findOne({ _id: `${message.guild.id}` });
				if (result) {
					const idTelegramChat = result.chatIdTele;

					if (message.embeds[0]) {
						message.embeds.forEach (async (item) => {
							switch (item.type) {
							case 'gifv':
								await botTelegram.sendAnimation(idTelegramChat, message.embeds[0].url);
								await botTelegram.sendMessage(idTelegramChat, `Autor: ${message.author.username}#${message.author.discriminator}`);
								break;
							default:
								botTelegram.sendMessage(idTelegramChat, `Content: ${message.content}\n\nAutor: ${message.author.username}#${message.author.discriminator}`);
							}
						});
					} else if (message.attachments) {
						message.attachments.forEach (async (item) => {
							const typeFile = item.url.match(/\.[0-9a-z]+$/i)[0];

							if (typeFile == '.png' || typeFile == '.jpg' || typeFile == '.jpeg' || typeFile == '.tiff' || typeFile == '.webp') {
								// Photo
								await botTelegram.sendPhoto(idTelegramChat, item.url);
							} else if (typeFile == '.mp4' || typeFile == '.mov' || typeFile == '.wmv' || typeFile == '.mkv') {
								// Video
								await botTelegram.sendVideo(idTelegramChat, item.url);
							} else if (typeFile == '.mp3' || typeFile == '.m4p' || typeFile == '.opus' || typeFile == '.flac') {
								// Audio
								await botTelegram.sendAudio(idTelegramChat, item.url);
							} else {
								// Document
								await botTelegram.sendDocument(idTelegramChat, item.url);
							}
							const caption = message.content ? `Caption: ${message.content}\n` : '';
							await botTelegram.sendMessage(idTelegramChat, `${caption}Autor: ${message.author.username}#${message.author.discriminator}`);
						});
					} else {
						botTelegram.sendMessage(idTelegramChat, `Content: ${message.content}\n\nAutor: ${message.author.username}#${message.author.discriminator}`);
					}
				}
			} catch (err) {
				console.error(err);
			} finally {
				mongoose.connection.close();
			}
		});
	},
};