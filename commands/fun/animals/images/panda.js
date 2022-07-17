const {
  SlashCommandBuilder,
  SlashCommandBooleanOption,
} = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("panda")
  .setDescription("Sends a random panda picture!")
  .addBooleanOption(option => option.setName('redpanda').setDescription('Sends a red panda picture instead of a regular panda'))

async function execute(client, interaction, subinteraction, config) {
  async function get_redpanda_interaction() {
    const row = new MessageActionRow();
    row.addComponents(
      new MessageButton()
        .setCustomId("newpanda")
        .setLabel("I want another one!")
        .setStyle(1)
        .setEmoji("🐼")
    );
    row.addComponents(
      new MessageButton()
        .setCustomId("delete")
        .setLabel("Delete")
        .setStyle(4)
        .setEmoji("🗑️")
    );
    if (typeof interaction.options != "undefined") {
      if (interaction.options.getBoolean("redpanda")) {
        var url = "https://some-random-api.ml/img/red_panda";
        var title = "Here's a red panda!";
      } else {
        var url = "https://some-random-api.ml/img/panda";
        var title = "Here's a panda!";
      }
    } else {
      if (interaction.message.embeds[0].title.includes("red")) {
        var url = "https://some-random-api.ml/img/red_panda";
        var title = "Here's a red panda!";
      } else {
        var url = "https://some-random-api.ml/img/panda";
        var title = "Here's a panda!";
      }
    }
    var response = await config.request(
      "GET",
      url
    );
    var response = await response.json();
    var redpanda_url = response.link;
    var redpandaEmbed = new MessageEmbed()
      .setColor(config.color)
      .setTitle(title)
      .setImage(redpanda_url)
      .setTimestamp()
      .setFooter({ text: "Powered by some-random-api.ml" });
    return { embeds: [redpandaEmbed], components: [row] };
  }
  if (interaction.isButton()) {
    if (interaction.user.id !== subinteraction.user.id) {
      return;
    }
    if (interaction.customId === "delete") {
      return await interaction.message.delete();
    } else if (interaction.customId === "newpanda") {
      await interaction.message.edit(await get_redpanda_interaction());
      return await interaction.deferUpdate();
    }
  }
  if (interaction.channel.id !== config.animal_images_channel) {
    await interaction.reply({
      content: `This command can only be used in <#${config.animal_images_channel}>`,
      ephemeral: true,
    });

    return;
  }
  await interaction.reply(await get_redpanda_interaction());
}

module.exports = {
  data,
  execute,
};
