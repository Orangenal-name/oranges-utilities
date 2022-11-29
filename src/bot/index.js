const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const fs = require("node:fs");

module.exports = () => {
    //*command registering
  const { REST, Routes } = require("discord.js");
  const { clientId, guildId, token } = require("./config.json");
  const fs = require("node:fs");

  const commands = [];
  // Grab all the command files from the commands directory you created earlier
  const commandFiles = fs
    .readdirSync("./src/bot/commands")
    .filter((file) => file.endsWith(".js"));

  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST({ version: "10" }).setToken(token);

  // and deploy your commands!
  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`
      );

      rest
        .put(Routes.applicationCommands(clientId), { body: [] })
        .then(() =>
          console.log("Successfully deleted all application commands.")
        )
        .catch(console.error);

      // The put method is used to fully refresh all commands in the guild with the current set
      const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      );

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  })();



  //*actual bot stuff
  const path = require("node:path");

  // Create a new client instance
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  });

  client.commands = new Collection();

  const commandsPath = path.join(__dirname, "commands");

  for (var file of commandFiles) {
    var filePath = path.join(commandsPath, file);
    var command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.deferred)
        await interaction.editReply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      else
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
    }
  });

  client.once(Events.ClientReady, (c) => {
    console.log(`Bot is ready! Logged in as ${c.user.tag}`);
  });

  client.login(token);

  return true;
};
