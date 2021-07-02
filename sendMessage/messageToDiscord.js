const mongo = require('../mongo');
const discordGuildSchema = require('../schemas/discord-guild-schema');
const TOKEN_TELEGRAM = process.env.TOKEN_TELEGRAM;

module.exports = {
	name: 'messageToDiscord',
	description: 'Send message from Telegram to Discord',
	async execute(botDiscord, botTelegram, msg, chatId) {
		let result;

		await mongo().then(async (mongoose) => {
			try {
				result = await discordGuildSchema.findOne({ chatIdTele: `${chatId}` });
				if (result) {
					const idDiscordChannel = result.channelIdDisc;
					const channelDiscord = botDiscord.channels.cache.get(idDiscordChannel);
					if (!msg.text) {
						if (msg.document) {
							// Document
							const fileInfo = await botTelegram.getFile(msg.document.file_id);
							const contentMessage = `https://api.telegram.org/file/bot${TOKEN_TELEGRAM}/${fileInfo.file_path}`;
							channelDiscord.send(`Autor: ${msg.from.first_name} ${msg.from.last_name}`);
							channelDiscord.send('Content: ', { files: [`${contentMessage}`] });
						} else if (msg.photo) {
							// Photo
							const fileInfo = await botTelegram.getFile(msg.photo[0].file_id);
							const contentMessage = `https://api.telegram.org/file/bot${TOKEN_TELEGRAM}/${fileInfo.file_path}`;
							channelDiscord.send(`Autor: ${msg.from.first_name} ${msg.from.last_name}`);
							channelDiscord.send('Content: ', { files: [`${contentMessage}`] });
							if (msg.caption) {
								channelDiscord.send(`Caption: ${msg.caption}`);
							}
						} else if (msg.video) {
							// Photo
							const fileInfo = await botTelegram.getFile(msg.video.file_id);
							const contentMessage = `https://api.telegram.org/file/bot${TOKEN_TELEGRAM}/${fileInfo.file_path}`;
							channelDiscord.send(`Autor: ${msg.from.first_name} ${msg.from.last_name}`);
							channelDiscord.send('Content: ', { files: [`${contentMessage}`] });
							channelDiscord.send('-----------------------------------');
						} else if (msg.audio) {
							// Audio
							const nameAudioFile = msg.audio.file_name.split('.')[0];
							channelDiscord.send(`Autor: ${msg.from.first_name} ${msg.from.last_name}`);
							try {
								const fileInfo = await botTelegram.getFile(msg.audio.file_id);
								const contentAudio = `https://api.telegram.org/file/bot${TOKEN_TELEGRAM}/${fileInfo.file_path}`;
								await channelDiscord.send('Audio: ', { files: [{ attachment: `${contentAudio}`, name: `${nameAudioFile}.mp3` }] });
							} catch (err) {
								console.error(err);
								channelDiscord.send(`Audio Name: ${nameAudioFile} \n Error: Audio size too long!`);
							}
						} else if (msg.voice) {
							// Voice
							const nameAudioFile = `Voice_Message_${msg.from.first_name}_${msg.from.last_name}`;
							channelDiscord.send(`Autor: ${msg.from.first_name} ${msg.from.last_name}`);
							try {
								const fileInfo = await botTelegram.getFile(msg.voice.file_id);
								const contentVoice = `https://api.telegram.org/file/bot${TOKEN_TELEGRAM}/${fileInfo.file_path}`;
								await channelDiscord.send('Voice: ', { files: [{ attachment: `${contentVoice}`, name: `${nameAudioFile}.mp3` }] });
							} catch (err) {
								console.error(err);
								channelDiscord.send('Voice Message Error: Audio size too long!');
							}
						} else if (msg.sticker) {
							const contentMessage = msg.sticker.emoji;
							channelDiscord.send(`Autor: ${msg.from.first_name} ${msg.from.last_name}`);
							channelDiscord.send(`Content: ${contentMessage}`);
						} else if (msg.location) {
							channelDiscord.send(`Autor: ${msg.from.first_name} ${msg.from.last_name}`);
							if (msg.venue) {
								const locationURL = encodeURI(`https://www.google.com/maps/search/?api=1&query=${msg.venue.title},%20${msg.venue.address}`);
								channelDiscord.send(`Location: ${locationURL}`);
							} else {
								channelDiscord.send(`Current Location: https://maps.google.com/?q=${msg.location.latitude},${msg.location.longitude}`);
							}
						}
						console.log(msg);
					} else {
						// Normal Message
						channelDiscord.send(`Autor: ${msg.from.first_name} ${msg.from.last_name}`);
						channelDiscord.send(`Content: ${msg.text}`);
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