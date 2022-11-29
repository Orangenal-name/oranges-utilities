import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'D:\\Documents\\Oranges utilities nextjs api\\database.sqlite',
    logging:false
});

export interface Features {
    guildId:string;
    order:boolean;
    time:boolean;
    timezones:object;
}

const featureSchema = sequelize.define('settings', {
    guildId: {
        type:DataTypes.STRING
    },
    order: {
        type:DataTypes.BOOLEAN
    },
    time: {
        type:DataTypes.BOOLEAN
    },
    timezones: {
        type:DataTypes.JSON
    }
});

featureSchema.sync()

export default sequelize.modelManager.addModel(featureSchema);