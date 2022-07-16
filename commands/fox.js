const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("fox")
  .setDescription("Sends a random fox picture!");

async function execute(client, interaction, subinteraction, config) {
  async function get_fox_interaction() {
    const row = new MessageActionRow();
    row.addComponents(
      new MessageButton()
        .setCustomId("newfox")
        .setLabel("I want another one!")
        .setStyle(1)
        .setEmoji("🦊")
    );
    row.addComponents(
      new MessageButton()
        .setCustomId("delete")
        .setLabel("Delete")
        .setStyle(4)
        .setEmoji("🗑️")
    );
    var response = await config.request("GET", "https://randomfox.ca/floof");
    var response = await response.json();
    var fox_url = response.image;
    var foxEmbed = new MessageEmbed()
      .setColor(config.color)
      .setTitle("Here's a fox!")
      .setImage(fox_url)
      .setTimestamp()
      .setFooter({ text: "Powered by randomfox.ca" });
    return { embeds: [foxEmbed], components: [row] };
  }
  if (interaction.isButton()) {
    if (interaction.user.id !== subinteraction.user.id) {
      return;
    }
    if (interaction.customId === "delete") {
      return await interaction.message.delete();
    } else if (interaction.customId === "newfox") {
      await interaction.message.edit(await get_fox_interaction());
      return await interaction.deferUpdate();
    }
  }
    if (interaction.channel.id !== config.animal_images_channel) {
        
        await interaction.reply({ content: `This command can only be used in <#${config.animal_images_channel}>`, ephemeral: true });
        
      return;
    }
  await interaction.reply(await get_fox_interaction());
}

module.exports = {
  data,
  execute,
};
