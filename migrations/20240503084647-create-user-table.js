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
      type: Sequelize.INTEGER
    },
    point: {
      type: Sequelize.INTEGER
    },
    profileAvatar: {
      type: Sequelize.STRING
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    },

    
    });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
     
  }
};
