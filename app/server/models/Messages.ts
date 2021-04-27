import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript'
import Chat from './Chat'
import User from './User'

@Table
class Messages extends Model<Messages> {
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    messageId: number;

    @BelongsTo(() => User)
    user: User;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    fromId: number;

    @Column(DataType.INTEGER)
    todId: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    text: string;

    @BelongsTo(() => Chat)
    chat: Chat;

    @AllowNull(false)
    @ForeignKey(() => Chat)
    @Column(DataType.INTEGER)
    chatId: number;
}

export default Messages;
