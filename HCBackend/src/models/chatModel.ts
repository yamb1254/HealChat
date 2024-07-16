import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./userModel";

interface ChatAttributes {
  id: number;
  userId: number;
  content: string;
  timestamp: Date;
}

interface ChatCreationAttributes extends Optional<ChatAttributes, "id"> {}

class Chat
  extends Model<ChatAttributes, ChatCreationAttributes>
  implements ChatAttributes
{
  public id!: number;
  public userId!: number;
  public content!: string;
  public timestamp!: Date;
}

Chat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Chat",
  }
);

Chat.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Chat, { foreignKey: "userId" });

export default Chat;
