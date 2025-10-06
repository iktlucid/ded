const { Client, GatewayIntentBits, SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
    partials: ['CHANNEL'] // required for DM support
});

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

const commands = [
    new SlashCommandBuilder()
        .setName('generate-sab')
        .setDescription('Sends a script to your DMs')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log('Slash commands registered.');
    } catch (err) {
        console.error(err);
    }
})();

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'generate-sab') {
        await interaction.reply({ content: '✅ Check your DMs!', ephemeral: true });
        try {
            await interaction.user.send('Here’s your script:\n```loadstring(game:HttpGet("https://pastefy.app/Ijclv4Gq/raw"))()```');
        } catch {
            await interaction.followUp({ content: '❌ I couldn’t DM you (you might have DMs off).', ephemeral: true });
        }
    }
});


client.login(token);
