import { config } from 'dotenv'
import express, {Express} from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import routes from '../routes';
const betterSqlite3 = require('better-sqlite3');
const expressSessionBetterSqlite3 = require('express-session-better-sqlite3');
const cookieParser = require("cookie-parser");

config();
require('../strategies/discord');

const db = new betterSqlite3("D:\\Documents\\Oranges utilities nextjs api\\database.sqlite")

const BetterSqlite3SessionStore = expressSessionBetterSqlite3(session, db);

export function createApp(): Express {
    const app = express();

    //wary middles
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    //Cors - short for containing overly random shit?
    app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"], credentials:true }))

    try {
        app.use(session({
            secret:"You aren't meant to see this: D(&*^ORSTA^dgfA&*dtsgbA()&WDh8d987ugaW&*^",
            resave:false,
            saveUninitialized:false,
            cookie:{
                maxAge:2592000000 //one month
            },
            store: new BetterSqlite3SessionStore()
        }))
    } catch (err) {
        console.log(err)
    }

    //papsporprot
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(cookieParser());

    app.use((req,res,next) => setTimeout(() => next(),800))

    app.use('/api', routes);

    return app;
}