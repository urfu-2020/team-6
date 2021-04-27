import {
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript'
import User from './User'

@Table
class Chat extends Model<Chat> {
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    chatId: number;

    @BelongsTo(() => User)
    users: User[]
}

export default Chat;


