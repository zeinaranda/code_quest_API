module.exports = (sequelize, DataTypes) => {
    const bossdone = sequelize.define('bossdone', {
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
          score: {
            type: DataTypes.INTEGER,
            allowNull: false 
          },
          time: {
            type: DataTypes.TIME,
            allowNull: false 
          },
          bossId: {
            type: DataTypes.TIME,
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

    return bossdone;
}