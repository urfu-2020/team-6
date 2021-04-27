import {Sequelize, SequelizeOptions} from 'sequelize-typescript';
import User from '../models/User'
import Chat from '../models/Chat'
import Messages from '../models/Messages'

function initDB () {
    const sequelizeOptions: SequelizeOptions = {
        host: 'hattie.db.elephantsql.com',
        port: 5432,
        username: 'skbbwibe',
        password: 'S_-F3dFEZ_5dzj15dxJkNdRmSKSllmxb',
        database: 'skbbwibe',

        dialect: 'postgres'
    };
    const sequelize = new Sequelize(sequelizeOptions);
    sequelize.addModels([Chat, User, Messages]);
}

export default initDB;
