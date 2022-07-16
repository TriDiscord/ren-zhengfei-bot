const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("node:fs");
const fetch = import("node-fetch");
const Discord = require("discord.js");
const client = new Discord.Client({ intents: 32767 });

async function HttpRequest(method, url) {
  return await (await fetch).default(url, { method: method });
}

var package_config = require("./package.json");

var config = {
  version: package_config.version,
  color: "584dff",
  prefix: process.env.PREFIX,
  animal_images_channel: process.env.ANIMAL_CHANNEL_ID,
  client_id: process.env.CLIENT_ID,
  guild_id: process.env.GUILD_ID,
  request: HttpRequest,
};

const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(config.client_id, config.guild_id),
      { body: commands }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

client.on("interactionCreate", async (interaction) => {
  for (const file of commandFiles) {
    const file_name = file.split("/").at(-1);
    if (!interaction.isCommand()) {
      var subinteraction = interaction.message.interaction;
      interaction.commandName = subinteraction.commandName;
    } else {
      var subinteraction = interaction;
    }
    if (interaction.commandName === file_name.split(".").at(0)) {
      const command = require(`./commands/${file}`);
      await command.execute(client, interaction, subinteraction, config);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
