const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName("test")
  .setDescription("ping pong")

async function execute(client, interaction, subinteraction, config) {
    if (interaction.isButton()) {
        if (interaction.user.id !== subinteraction.user.id) {
            return;
        }
        if (interaction.customId === "delete") {
            return await interaction.message.delete();
        }
    }
    const row = new MessageActionRow()
    row.addComponents(new MessageButton()
        .setCustomId("delete")
        .setLabel("Delete")
        .setStyle(4)
        .setEmoji("🗑️")
    );
    await interaction.reply({ content: 'Pong!', components: [row] });
}

module.exports = {
    data,
    execute,
}
