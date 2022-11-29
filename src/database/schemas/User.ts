import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'D:\\Documents\\Oranges utilities nextjs api\\database.sqlite',
    logging:false
});

export interface User {
    id:string;
    discordId:string;
    accessToken:string;
    refreshToken:string;
}

const userSchema = sequelize.define('users', {
    discordId: {
        type:DataTypes.STRING
    },
    accessToken: {
        type:DataTypes.STRING
    },
    refreshToken: {
        type:DataTypes.STRING
    }
});

userSchema.sync()

export default sequelize.modelManager.addModel(userSchema);