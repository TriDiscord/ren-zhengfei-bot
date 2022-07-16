const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("duck")
  .setDescription("Sends a random duck picture!");

async function execute(client, interaction, subinteraction, config) {
  async function get_duck_interaction() {
    const row = new MessageActionRow();
    row.addComponents(
      new MessageButton()
        .setCustomId("newduck")
        .setLabel("I want another one!")
        .setStyle(1)
        .setEmoji("🦆")
    );
    row.addComponents(
      new MessageButton()
        .setCustomId("delete")
        .setLabel("Delete")
        .setStyle(4)
        .setEmoji("🗑️")
    );
    var response = await config.request("GET", "https://random-d.uk/api/random");
    var response = await response.json();
    var duck_url = response.url;
    var duckEmbed = new MessageEmbed()
      .setColor(config.color)
      .setTitle("Here's a duck!")
      .setImage(duck_url)
      .setTimestamp()
      .setFooter({ text: "Powered by random-d.uk" });
    return { embeds: [duckEmbed], components: [row] };
  }
  if (interaction.isButton()) {
    if (interaction.user.id !== subinteraction.user.id) {
      return;
    }
    if (interaction.customId === "delete") {
      return await interaction.message.delete();
    } else if (interaction.customId === "newduck") {
      await interaction.message.edit(await get_duck_interaction());
      return await interaction.deferUpdate();
    }
  }
    if (interaction.channel.id !== config.animal_images_channel) {
        
        await interaction.reply({ content: `This command can only be used in <#${config.animal_images_channel}>`, ephemeral: true });
        
      return;
    }
  await interaction.reply(await get_duck_interaction());
}

module.exports = {
  data,
  execute,
};
