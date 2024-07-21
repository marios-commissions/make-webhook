require('dotenv').config();

const { Client, IntentsBitField, TextChannel } = require('discord.js');
const { Routes } = require('discord-api-types/v10');
const input = require('input');

async function init() {
	const client = new Client({ intents: [IntentsBitField.Flags.Guilds] });

	const token = process.env.TOKEN ?? (await input.text('Please enter the bot\'s token: '));
	const serverID = process.env.SERVER ?? (await input.text('Please enter the server\'s ID: '));
	const channelID = process.env.CHANNEL ?? (await input.text('Please enter the channels\'s ID: '));

	client.on('ready', async () => {
		const guild = client.guilds.cache.get(serverID);
		if (!guild) {
			console.error('Provided server ID was invalid or the bot is not in it. Please try again.');
			return exit(client);
		}

		const channel = guild.channels.cache.get(channelID);
		if (!channel) {
			console.error('Provided channel ID was invalid or the bot is not in it. Please try again.');
			return exit(client);
		}

		const hook = await channel.createWebhook({ name: 'Captain Hook' });
		console.log(`Webhook created: https://discord.com/api/v10${Routes.webhook(hook.id, hook.token)}`);
	});

	client.login(token);
}

async function exit(client) {
	await client.destroy();
	process.exit(-1);
}

init();