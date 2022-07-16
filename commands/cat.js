const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("cat")
  .setDescription("Sends a random cat picture!");

async function execute(client, interaction, subinteraction, config) {
  async function get_cat_interaction() {
    const row = new MessageActionRow();
    row.addComponents(
      new MessageButton()
        .setCustomId("newcat")
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
    var response = await config.request("GET", "https://aws.random.cat/meow");
    var response = await response.json();
    var cat_url = response.file;
    var embed = new MessageEmbed()
      .setColor(config.color)
      .setTitle("Here's a cat!")
      .setImage(cat_url)
      .setTimestamp()
      .setFooter({ text: "Powered by random.cat" });
    return { embeds: [embed], components: [row] };
  }
  if (interaction.isButton()) {
    if (interaction.user.id !== subinteraction.user.id) {
      return;
    }
    if (interaction.customId === "delete") {
      return await interaction.message.delete();
    } else if (interaction.customId === "newcat") {
      await interaction.message.edit(await get_cat_interaction());
      return await interaction.deferUpdate();
    }
  }
  await interaction.reply(await get_cat_interaction());
}

module.exports = {
  data,
  execute,
};
