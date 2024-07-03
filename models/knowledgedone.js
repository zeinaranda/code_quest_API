module.exports = (sequelize, DataTypes) => {
    const KnowledgeDone = sequelize.define('KnowledgeDone', {
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
          point: {
            type: DataTypes.INTEGER,
            allowNull: false 
          },
          koin: {
            type: DataTypes.INTEGER,
            allowNull: false 
          },
          knowledgeId: {
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
        tableName: 'knowledgedone'
    });


    return KnowledgeDone;
}