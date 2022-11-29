const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { Features } = require("../../database/schemas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("order")
    .setDescription("Shows the order people joined the server in"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    var guild = interaction.guild;

    var [features, ree] = await Features.findOrCreate({
      where: { guildId: guild.id },
      defaults: {
        order: false,
        time: false,
        timezones: {},
      },
    });
    var order = await features.get("order");
    if (!order) {
      return await interaction.editReply({
        content: "That feature is not turned on on this server!",
        ephemeral: true,
      });
    }

    var members = undefined;
    var rank = 1;
    var order = 0;
    var page = 0;
    var ordered = [];
    var response = [""];

    await guild.members.fetch().then((guildMembers) => {
      members = guildMembers.values();
    });

    members = Array.from(members);

    members.sort(
      (a, b) => parseFloat(a.joinedTimestamp) - parseFloat(b.joinedTimestamp)
    );

    members.forEach((member) => {
      //if (!member.user.bot) {
      ordered.push(
        rank.toString() +
          ": " +
          member.displayName +
          " - " +
          member.joinedAt.toString().split(" ")[0] +
          " " +
          member.joinedAt.toString().split(" ")[1] +
          " " +
          member.joinedAt.toString().split(" ")[2] +
          " " +
          member.joinedAt.toString().split(" ")[3] +
          "\n"
      );
      rank++;
      //}
    });

    ordered.forEach((member) => {
      if (order < 10) {
        response[page] += member;
        order++;
      } else {
        page++;
        response[page] = member;
        order = 1;
      }
    });

    page = 0;

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Members sorted by join date")
      .setDescription(response[page]);

    const next = new ButtonBuilder()
      .setCustomId("next")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("▶️");

    const back = new ButtonBuilder()
      .setCustomId("back")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("◀️")
      .setDisabled(true);

    if (response.length == 1) {
      next.setDisabled(true);
    }

    const row = new ActionRowBuilder().addComponents([back,next]);

    const collector = interaction.channel.createMessageComponentCollector({
      time: 15000,
    });

    collector.on("collect", async (i) => {
      const embed2 = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Members sorted by join date")
      .setDescription(response[page]);

      const next2 = new ButtonBuilder()
        .setCustomId("next")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("▶️");

      const back2 = new ButtonBuilder()
        .setCustomId("back")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("◀️")
        .setDisabled(true);

      const row2 = new ActionRowBuilder().addComponents([back2,next2]);

      if (i.customId == "next") {

        page++;
        embed2.setDescription(response[page]);

        if (page == response.length - 1) {
          next2.setDisabled(true);
        } else next2.setDisabled(false);

        back2.setDisabled(false);
        await i.update({ embeds: [embed2], components: [row2] });

      } else if (i.customId == "back") {

        page--;
        embed2.setDescription(response[page]);

        if (page == 0) {
          back2.setDisabled(true);
        } else back2.setDisabled(false);

        next2.setDisabled(false)
        await i.update({ embeds: [embed2], components: [row2] });

      }
    });

    return await interaction.editReply({
      embeds: [embed],
      ephemeral: true,
      components: [row],
    });
  },
};
