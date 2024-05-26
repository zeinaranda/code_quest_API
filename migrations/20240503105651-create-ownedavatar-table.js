'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ownedavatar', {  
      ownedId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false 
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'user',  // Nama tabel yang akan dijadikan referensi
        key: 'userId',       // Nama kolom pada tabel referensi
    },
    },
    avatarId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'avatar',  // Nama tabel yang akan dijadikan referensi
        key: 'avatarId',       // Nama kolom pada tabel referensi
    },
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
    
  });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ownedavatar');
  }
};
