import { Request, Response } from "express";
import { User } from "../../database/schemas/User";
import {
  getGuildService,
  getMembersService,
  getMutualGuildsService,
} from "../../services/guilds";

export async function getGuildsController(req: Request, res: Response) {
  const user = req.user as User;
  try {
    const guilds = await getMutualGuildsService(user.id);
    res.send(guilds);
  } catch (err) {
    console.log(err);
    res.status(400).send({ msg: "Error" });
  }

  res.status(200);
}

export async function getGuildPermissionsController(
  req: Request,
  res: Response
) {
  const user = req.user as User;
  const { id } = req.params;
  try {
    const guilds = await getMutualGuildsService(user.id);
    const valid = guilds.some((guild) => guild.id === id);
    return valid ? res.sendStatus(200) : res.sendStatus(403);
  } catch (err) {
    console.log(err);
    res.status(400).send({ msg: "Error" });
  }
}

export async function getGuildController(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const { data: guild } = await getGuildService(id);
    res.send(guild);
  } catch (err) {
    console.log(err);
    res.status(400).send({ msg: "Error" });
  }
}

export async function getGuildMembersController(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const { data } = await getMembersService(id);
    var response: string[] = [];
    for (var i = 0; i < Object.keys(data).length; i++) {
      response.push(`${data[i].user.username}#${data[i].user.discriminator}`);
    }
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(400).send({ msg: "Error" });
  }
}
