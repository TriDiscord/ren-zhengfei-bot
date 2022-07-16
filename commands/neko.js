const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("neko")
  .setDescription("Sends a random neko picture!");

async function execute(client, interaction, subinteraction, config) {
  async function get_neko_interaction() {
    const row = new MessageActionRow();
    row.addComponents(
      new MessageButton()
        .setCustomId("newneko")
        .setLabel("I want another one!")
        .setStyle(1)
        //.setEmoji("")
    );
    row.addComponents(
      new MessageButton()
        .setCustomId("delete")
        .setLabel("Delete")
        .setStyle(4)
        .setEmoji("🗑️")
    );
    var response = await config.request("GET", "https://nekos.life/api/v2/img/neko");
    var response = await response.json();
    var neko_url = response.url;
    var nekoEmbed = new MessageEmbed()
      .setColor(config.color)
      .setTitle("Here's a neko!")
      .setImage(neko_url)
      .setTimestamp()
      .setFooter({ text: "Powered by nekos.life" });
    return { embeds: [nekoEmbed], components: [row] };
  }
  if (interaction.isButton()) {
    if (interaction.user.id !== subinteraction.user.id) {
      return;
    }
    if (interaction.customId === "delete") {
      return await interaction.message.delete();
    } else if (interaction.customId === "newneko") {
      await interaction.message.edit(await get_neko_interaction());
      return await interaction.deferUpdate();
    }
  }
    if (interaction.channel.id !== '996019749911789618') {
        
        await interaction.reply({ content: `This command can only be used in <#996019749911789618>`, ephemeral: true });
        
      return;
    }
  await interaction.reply(await get_neko_interaction());
}

module.exports = {
  data,
  execute,
};
