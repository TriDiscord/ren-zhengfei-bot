const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("dog")
  .setDescription("Sends a random dog picture!");

async function execute(client, interaction, subinteraction, config) {
  async function get_dog_interaction() {
    const row = new MessageActionRow();
    row.addComponents(
      new MessageButton()
        .setCustomId("newdog")
        .setLabel("I want another one!")
        .setStyle(1)
        .setEmoji("🐶")
    );
    row.addComponents(
      new MessageButton()
        .setCustomId("delete")
        .setLabel("Delete")
        .setStyle(4)
        .setEmoji("🗑️")
    );
    var response = await config.request("GET", "https://dog.ceo/api/breeds/image/random");
    var response = await response.json();
    var dog_url = response.message;
    var embed = new MessageEmbed()
      .setColor(config.color)
      .setTitle("Here's a dog!")
      .setImage(dog_url)
      .setTimestamp()
      .setFooter({ text: "Powered by dog.ceo" });
    return { embeds: [embed], components: [row] };
  }
  if (interaction.isButton()) {
    if (interaction.user.id !== subinteraction.user.id) {
      return;
    }
    if (interaction.customId === "delete") {
      return await interaction.message.delete();
    } else if (interaction.customId === "newdog") {
      await interaction.message.edit(await get_dog_interaction());
      return await interaction.deferUpdate();
    }
  }
    if (interaction.channel.id !== config.animal_images_channel) {
        
        await interaction.reply({ content: `This command can only be used in <#${config.animal_images_channel}>`, ephemeral: true });
        
      return;
    }
  await interaction.reply(await get_dog_interaction());
}

module.exports = {
  data,
  execute,
};
