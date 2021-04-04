const mongo = require('../mongo');
const discordGuildSchema = require('../schemas/discord-guild-schema');

module.exports = {
	name: 'token',
	description: 'Consult token',
	async execute(client, message) {
		const { member, channel, guild } = message;

		if (!member.hasPermission('ADMINISTRATOR')) {
			channel.send('You do not have permission to run this command.');
			return;
		}


		await mongo().then(async (mongoose) => {
			try {
				let result = await discordGuildSchema.findOne({ _id: guild.id });
				const telegramChannel = client.channels.cache.find(item => item.name === 'telegram-group');

				if (result && telegramChannel) {
					// Guarantees that the MongoDb channel's id registered is the same as the id found in the Guild.
					if (result.channelIdDisc !== telegramChannel.id) {
						const rand = Math.random().toString(36).substr(2);
						const newToken = guild.id + '-' + telegramChannel.id + '-' + rand;

						result = await discordGuildSchema.findOneAndUpdate({
							_id: guild.id,
						}, {
							channelIdDisc: telegramChannel.id,
							token: newToken,
						}, {
							new: true,
							upsert: true,
						});
					}
				} else if(!result && telegramChannel) {
					// Registers the Telegram-Group's id in MongoDB without creating a new channel.
					const rand = Math.random().toString(36).substr(2);
					const newToken = guild.id + '-' + telegramChannel.id + '-' + rand;

					result = await discordGuildSchema.findOneAndUpdate({
						_id: guild.id,
					}, {
						_id: guild.id,
						channelIdDisc: telegramChannel.id,
						token: newToken,
						titleDisc: guild.name,
					}, {
						new: true,
						upsert: true,
					});
				} else if (!telegramChannel) {
					// Creates a new 'Telegram-Group' Channel and registers it on MongoDB.
					const newTelegramChannelId = await guild.channels.create('telegram-group', { reason: 'Needed a channel called "telegram-group".' })
						.then((channelId) => {
							channelId.send('Here you will receive and send messages to Telegram.\nYou can add this channel in any category channel.');
							return channelId;
						});
					const rand = Math.random().toString(36).substr(2);
					const newToken = await guild.id + '-' + newTelegramChannelId + '-' + rand;

					result = await discordGuildSchema.findOneAndUpdate({
						_id: guild.id,
					}, {
						_id: guild.id,
						channelIdDisc: newTelegramChannelId,
						token: newToken,
						titleDisc: guild.name,
					}, {
						new: true,
						upsert: true,
					});
				}
				await channel.send(`Seu token é: ${result.token}\nParra conectar esse chat ao Telegram é preciso usar o comando "%setToken " + o token.`);
			} catch (err) {
				console.error(err);
				channel.send('Ocorreu um erro!');
			} finally {
				mongoose.connection.close();
			}
		});

	},
};