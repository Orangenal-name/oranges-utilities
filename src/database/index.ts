import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect:"sqlite",
    storage:"D:/Documents/Oranges utilities nextjs api/database.sqlite",
    logging:false
});

async function poo() {
try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
poo()