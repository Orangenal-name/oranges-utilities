import {Strategy, Profile} from 'passport-discord';
import passport from 'passport';
import {VerifyCallback} from 'passport-oauth2'
import {User} from "../database/schemas";

passport.serializeUser((user: any, done) => {
    return done(null, user.id)
})

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findByPk(id)
        return user ? done(null, user) : done(null, null)
    } catch (err) {
        console.log(err)
        return done(err, null)
    }
})


passport.use(
    new Strategy(
        {
            clientID: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            callbackURL:  process.env.DISCORD_REDIRECT_URL,
            scope: ['identify','email','guilds']
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: VerifyCallback
        ) => {
            const {id: discordId} = profile
            try {
                //apparently it's good practice to comment your code but this is such spaghetti I might as well be italian
                const existingUser = await User.findOne({where:{discordId:discordId}})
                if (existingUser) {
                    existingUser.update({accessToken:accessToken,refreshToken:refreshToken});
                    existingUser.save();
                    return done(null,existingUser)
                }
                const newUser = User.create({discordId:discordId,accessToken:accessToken,refreshToken:refreshToken})
                return done(null,newUser)
            } catch (err) {
                console.log(err)
                return done(err as any,undefined)
            }
        }
    )
)