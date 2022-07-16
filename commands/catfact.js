const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("catfact")
  .setDescription("Sends a random cat fact!");

async function execute(client, interaction, subinteraction, config) {
  async function get_cfact_interaction() {
    const row = new MessageActionRow();
    row.addComponents(
      new MessageButton()
        .setCustomId("newcfact")
        .setLabel("I want another one!")
        .setStyle(1)
        .setEmoji("😻")
    );
    row.addComponents(
      new MessageButton()
        .setCustomId("delete")
        .setLabel("Delete")
        .setStyle(4)
        .setEmoji("🗑️")
    );
    var response = await config.request("GET", "https://catfact.ninja/fact");
    var response = await response.json();
    var cfact_url = response.fact;
    var cfactEmbed = new MessageEmbed()
      .setColor(config.color)
      .setTitle("Here's a random cat fact!")
      .setDescription(cfact_url)
      .setTimestamp()
      .setFooter({ text: "Powered by catfact.ninja" });
    return { embeds: [cfactEmbed], components: [row] };
  }
  if (interaction.isButton()) {
    if (interaction.user.id !== subinteraction.user.id) {
      return;
    }
    if (interaction.customId === "delete") {
      return await interaction.message.delete();
    } else if (interaction.customId === "newcfact") {
      await interaction.message.edit(await get_cfact_interaction());
      return await interaction.deferUpdate();
    }
  }
    if (interaction.channel.id !== config.animal_images_channel) {
        
        await interaction.reply({ content: `This command can only be used in <#${config.animal_images_channel}>`, ephemeral: true });
        
      return;
    }
  await interaction.reply(await get_cfact_interaction());
}

module.exports = {
  data,
  execute,
};
