module.exports = (sequelize, DataTypes) => {
    const progress = sequelize.define('progress', {
        progressId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false 
          },
          stageOne: {
            type: DataTypes.FLOAT,
          },
          stageTwo: {
            type: DataTypes.FLOAT,
          },
          stageThree: {
            type: DataTypes.FLOAT,
          },
          stageFour: {
            type: DataTypes.FLOAT,
          },
          stageFive: {
            type: DataTypes.FLOAT,
          },
          stageSix: {
            type: DataTypes.FLOAT,
          },
          stageSeven: {
            type: DataTypes.FLOAT,
          },
          stageEIght: {
            type: DataTypes.FLOAT,
          },
          stageNine: {
            type: DataTypes.FLOAT,
          },
          ranking: {
            type: DataTypes.INTEGER,
            allowNull: false 
          },
          userId: {
            type: DataTypes.INTEGER,
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
        tableName: 'progress'
    });


    return progress;
}