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
          test: {
            type: DataTypes.STRING,
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
        UserStage.belongsTo(models.Stage, { foreignKey: 'stageId' });  // Ensure this line is present
    };






 
    return UserStage;
}