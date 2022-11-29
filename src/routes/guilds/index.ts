import { Router } from "express";
import {
  getGuildController,
  getGuildMembersController,
  getGuildPermissionsController,
  getGuildsController,
} from "../../controllers/guilds";
import { isAuthenticated } from "../../utils/middlewares";
import { Features } from "../../database/schemas";

const router = Router();

router.get("/", isAuthenticated, getGuildsController);

router.get("/:id/permissions", isAuthenticated, getGuildPermissionsController);

router.get("/:id", isAuthenticated, getGuildController);

router.post("/:id/features", isAuthenticated, async (req, res) => {
  try {
    var [features, ree] = await Features.findOrCreate({
      where: { guildId: req.body.guild },
      defaults: {
        order: false,
        time: false,
        timezones: {},
      },
    });
    features.set("order", req.body.order);
    features.set("time", req.body.tz);
    features.set("timezones",req.body.timezones)
    features.save();
    if (ree) res.sendStatus(201);
    else res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/:id/members", isAuthenticated, getGuildMembersController);

router.get("/:id/features", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    var [features, ree] = await Features.findOrCreate({
      where: { guildId: id },
      defaults: {
        order: false,
        time: false,
        timezones: {},
      },
    });
    var response = undefined;
    if (ree) {
      response = {
        order: false,
        time: false,
        timezones: {},
      };
    } else {
      response = {
        order: await features.get("order"),
        time: await features.get("time"),
        timezones: await features.get("timezones"),
      };
    }
    res.send(response);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

export default router;
