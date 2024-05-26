module.exports = (sequelize, DataTypes) => {
    const knowledgedone = sequelize.define('knowledgedone', {
        knowledgeDoneId: {
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
          knowledgeId: {
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
        tableName: 'knowledgedone'
    });


    return knowledgedone;
}