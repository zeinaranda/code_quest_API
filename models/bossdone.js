module.exports = (sequelize, DataTypes) => {
    const BossDone = sequelize.define('BossDone', {
        bossDoneId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false 
          },
          quizDone: {
            type: DataTypes.BOOLEAN,
            allowNull: false 
          },
          point: {
            type: DataTypes.INTEGER,
            allowNull: false 
          },
          koin: {
            type: DataTypes.INTEGER,
            allowNull: false 
          },
          bossId: {
            type: DataTypes.INTEGER,
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
        tableName: 'bossdone'
    });

    return BossDone;
}