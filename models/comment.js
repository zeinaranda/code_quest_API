module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
      commentId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
      },
      content: {
          type: DataTypes.TEXT,
          allowNull: false
      },
      userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: 'User',
              key: 'userId'
          }
      },
      postId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: 'Post',
              key: 'postId'
          }
      },
      createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
      },
      updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
      }
  }, {
      tableName: 'comment'
  });

  Comment.associate = function(models) {
      Comment.belongsTo(models.User, {
          foreignKey: 'userId',
          as: 'user'
      });
  };

  return Comment;
};
