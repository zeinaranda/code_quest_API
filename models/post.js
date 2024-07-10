module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    postId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Uncomment and customize if you have a User model
      references: {
        model: 'User',
        key: 'userId'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'post',
    timestamps: true,
    // Other model options go here
  });



  Post.associate = function(models) {
    // Define associations here
    // Example:
    Post.belongsTo(models.User, { foreignKey: 'userId',as: 'user'}); // Asosiasi dengan alias 'author'
    Post.hasMany(models.Comment, { foreignKey: 'postId',as: 'comment' }); // Asosiasi dengan model Comment
  };

  return Post;
};
