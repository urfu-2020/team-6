import {
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript'
import Chat from './Chat'

@Table
class User extends Model<User> {
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    userId: number;

    @Column(DataType.STRING)
    name: string;

    @Column(DataType.STRING)
    avatar: string;

    @BelongsTo(() => Chat)
    chats: Chat[]
}

export default User;
