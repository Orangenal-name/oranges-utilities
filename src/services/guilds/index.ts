import axios from "axios";
import { User } from "../../database/schemas/";
import { DISCORD_API_URL } from "../../utils/constants";
import { PartialGuild } from "../../utils/types";

export function getBotGuildsService() {
  const TOKEN = process.env.DISCORD_BOT_TOKEN;
  return axios.get<PartialGuild[]>(`${DISCORD_API_URL}/users/@me/guilds`, {
    headers: { Authorization: `Bot ${TOKEN}` },
  });
}

export async function getUserGuildsService(id: string) {
  const user = await User.findByPk(id);
  if (!user) throw new Error("No user found.");
  return axios.get<PartialGuild[]>(`${DISCORD_API_URL}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${user.get("accessToken")}` },
  });
}

export async function getMutualGuildsService(id: string) {
  const { data: botGuilds } = await getBotGuildsService();
  setTimeout(() => {}, 200);
  const { data: userGuilds } = await getUserGuildsService(id);
  const adminUserGuilds = userGuilds.filter(
    ({ permissions }) => (parseInt(permissions) & 0x8) === 0x8
  );
  return adminUserGuilds.filter((guild) =>
    botGuilds.some((botGuild) => botGuild.id === guild.id)
  );
}

export function getGuildService(id: string) {
  const TOKEN = process.env.DISCORD_BOT_TOKEN;
  return axios.get<PartialGuild>(`${DISCORD_API_URL}/guilds/${id}`, {
    headers: {
      Authorization: `Bot ${TOKEN}`,
    },
  });
}

export function getMembersService(id: string) {
  const TOKEN = process.env.DISCORD_BOT_TOKEN;
  return axios.get(`${DISCORD_API_URL}/guilds/${id}/members`, {
    params: { limit: 100 },
    headers: {
      Authorization: `Bot ${TOKEN}`,
    },
  });
}
