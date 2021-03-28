const mongo = require('../mongo');
const discordGuilsSchema = require('../schemas/discord-guild-schema');

module.exports = {
	name: 'token',
	description: 'Consult token',
	async execute(client, message) {
		const { member, channel, guild } = message;

		if (!member.hasPermission('ADMINISTRATOR')) {
			channel.send('You do not have permission to run this command.');
			return;
		}

		let result;

		await mongo().then(async (mongoose) => {
			try {
				result = await discordGuilsSchema.findOne({ _id: guild.id });

				if (!result) {
					const rand = Math.random().toString(36).substr(2);
					const newToken = guild.id + '-' + channel.id + '-' + rand;

					result = await discordGuilsSchema.findOneAndUpdate({
						_id: guild.id,
					}, {
						_id: guild.id,
						channelIdDisc: channel.id,
						token: newToken,
						titleDisc: channel.name,
					}, {
						upsert: true,
					});
				}
			} catch (err) {
				console.error(err);
			} finally {
				mongoose.connection.close();
			}
		});

		channel.send(`Seu token é: ${result.token}\nParra conectar esse chat ao Telegram é preciso usar o comando "Não sei o comando ainda" + o token.`);
	},
};