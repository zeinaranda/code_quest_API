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

    return Stage;
}