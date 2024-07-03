'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('user', { 
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false 
    },
    nim: {
      type: Sequelize.STRING,
      allowNull: false
    },
    nama: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    koin: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    point: {
      type: Sequelize.INTEGER,
      defaultValue: 0

    },
    profileAvatar: {
      type: Sequelize.STRING,
      allowNull: true
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    ownedAvatars: {
      type: Sequelize.JSON,  // Gunakan tipe data JSON
      allowNull: false,
      defaultValue: []
    },

    firstLogin: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    
    });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
     
  }
};
