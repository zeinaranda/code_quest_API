module.exports = (sequelize, DataTypes) => {
    const Stage = sequelize.define('Stage', {
        stageId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false 
          },
          nameStage: {
            type: DataTypes.STRING,
            allowNull: false
          },
          bgImage: {
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
    }, {
        tableName: 'stage'
    });

    Stage.associate = function(models) {
      Stage.belongsToMany(models.User, { through: models.UserStage, foreignKey: 'stageId' });

      Stage.associate = function(models) {
        Stage.hasMany(models.UserStage, { foreignKey: 'stageId' });  // Add this line
    };

  };

    return Stage;
}