const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("lizard")
  .setDescription("Sends a random lizard picture!");

async function execute(client, interaction, subinteraction, config) {
  async function get_lizard_interaction() {
    const row = new MessageActionRow();
    row.addComponents(
      new MessageButton()
        .setCustomId("newlizard")
        .setLabel("I want another one!")
        .setStyle(1)
        .setEmoji("🐨")
    );
    row.addComponents(
      new MessageButton()
        .setCustomId("delete")
        .setLabel("Delete")
        .setStyle(4)
        .setEmoji("🗑️")
    );
    var response = await config.request("GET", "https://nekos.life/api/v2/img/lizard");
    var response = await response.json();
    var lizard_url = response.url;
    var lizardEmbed = new MessageEmbed()
      .setColor(config.color)
      .setTitle("Here's a lizard!")
      .setImage(lizard_url)
      .setTimestamp()
      .setFooter({ text: "Powered by nekos.life" });
    return { embeds: [lizardEmbed], components: [row] };
  }
  if (interaction.isButton()) {
    if (interaction.user.id !== subinteraction.user.id) {
      return;
    }
    if (interaction.customId === "delete") {
      return await interaction.message.delete();
    } else if (interaction.customId === "newlizard") {
      await interaction.message.edit(await get_lizard_interaction());
      return await interaction.deferUpdate();
    }
  }
    if (interaction.channel.id !== config.animal_images_channel) {
        
        await interaction.reply({ content: `This command can only be used in <#${config.animal_images_channel}>`, ephemeral: true });
        
      return;
    }
  await interaction.reply(await get_lizard_interaction());
}

module.exports = {
  data,
  execute,
};
