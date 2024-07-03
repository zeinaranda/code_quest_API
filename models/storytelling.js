module.exports = (sequelize, DataTypes) => {
  const Storytelling = sequelize.define('Storytelling', {
    storyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    stageId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatarId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    codeScene: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'storytelling'
  });

  Storytelling.associate = (models) => {
    Storytelling.belongsTo(models.Avatar, {
      foreignKey: 'avatarId',
      as: 'avatar',
    });
    Storytelling.belongsTo(models.Stage, {
      foreignKey: 'stageId',
      as: 'stage',
    });
  };

  return Storytelling;
};
