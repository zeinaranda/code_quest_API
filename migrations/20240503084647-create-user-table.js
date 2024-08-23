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
    rank: { // Tambahkan kolom untuk menyimpan poin sebelumnya
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    previousRank: { // Track previous rank
      type: Sequelize.INTEGER,
      defaultValue: 0
  },
    rankArrow: { // Tambahkan kolom untuk status panah
      type: Sequelize.STRING,
      defaultValue: 'none'
    },
    rankChange: { // Menyimpan perubahan peringkat sebagai string seperti "+3" atau "-2"
      type: Sequelize.STRING,
      defaultValue: ''
  }
    
    });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
     
  }
};
