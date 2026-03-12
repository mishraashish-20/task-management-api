import { DataTypes } from "sequelize";
import { sequelize } from "../../db/mysql.js";

export const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    role: {
      type: DataTypes.ENUM("ADMIN", "MANAGER", "USER"),
      allowNull: false,
      defaultValue: "USER",
    },
    managerId: { type: DataTypes.BIGINT, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
);

User.belongsTo(User, {
  as: "manager",
  foreignKey: "managerId",
  constraints: true,
  onDelete: "SET NULL",
});
