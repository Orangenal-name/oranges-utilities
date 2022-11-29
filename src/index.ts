import {config} from 'dotenv'
import {createApp} from './utils/createApp'
import './database'

const bot = require("./bot")

config();

const port = process.env.PORT || 3000;

async function main() {

    try {
        const app = createApp();
        app.listen(port, () => console.log("API is running on port " + port))
        bot();
    } catch (err) {
        console.log(err)
    }
}


main()