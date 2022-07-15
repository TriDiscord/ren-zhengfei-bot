const Discord = require("discord.js");
const client = new Discord.Client({ intents: 32767 });
const fetch = import("node-fetch");

async function HttpRequest(method, url) {
  return await (await fetch).default(url, { method: method });
}

var package_config = require("./package.json");

var config = {
  version: package_config.version,
  color: "584dff",
  prefix: "!",
  animal_images_channel: process.env.ANIMAL_CHANNEL_ID,
  request: HttpRequest,
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  console.log(
    `\nVariables:\nprefix: ${config.prefix}\nanimal_images_channel: ${config.animal_images_channel}`
  );
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;
  if (msg.content.indexOf(config.prefix) !== 0) return;
  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const fs = require("fs");
  var err, files = fs.readdirSync("./commands");
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    if (file.endsWith(".js") && file.split(".")[0] === command) {
      var commandFile = require(`./commands/${file}`);
      commandFile.execute(client, msg, args, config);
      return;
    }
  }

  msg.reply(`Invalid command!`).then((message) => {
    setTimeout(() => {
      msg.delete();
      message.delete();
    }, 5000);
  });
});

client.login(process.env.DISCORD_TOKEN);
