import {Router} from 'express'
import passport from 'passport'

const router = Router();

router.get("/discord", (req,res,next) => {
    if (req.user) res.redirect("http://localhost:3001/menu");
    else next();
}, passport.authenticate('discord'), (req,res) => {
    res.sendStatus(200);
});

router.get("/discord/redirect", passport.authenticate('discord'), (req,res) => {
    res.redirect('http://localhost:3001/menu')
});

router.get("/logout", (req,res) => {
    res.clearCookie("connect.sid");
    res.redirect("http://localhost:3001/")
})

router.get("/status", (req,res) => {
    return req.user ? res.send(req.user) : res.status(401).send({msg: "Unauthorized"});
})

export default router