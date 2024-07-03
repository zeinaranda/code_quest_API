module.exports = (sequelize, DataTypes) => {
    const UserStage = sequelize.define('UserStage', {
        userStageId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
          },
          userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          stageId: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          progressPoint: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
          }
         
    }, {
        tableName: 'userstage'
    });

    UserStage.associate = function(models) {
      UserStage.belongsTo(models.User, { foreignKey: 'userId' });

  };


 
    return UserStage;
}