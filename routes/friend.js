// Misalkan Anda menggunakan Express.js
const express = require('express');
const router = express.Router();
const { Friend, User } = require('../models'); // Pastikan mengimpor models dengan benar

// Endpoint untuk menambahkan teman baru
router.post('/', async (req, res) => {
    const { userId, friendUserId } = req.body;

    try {
        const newFriend = await Friend.create({
            userId,
            friendUserId,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json(newFriend);
    } catch (error) {
        console.error('Error creating friend relationship:', error);
        res.status(500).json({ error: 'Failed to create friend relationship' });
    }
});

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const friends = await Friend.findAll({
            where: { userId },
            include: [
                { model: User, as: 'friendUser', attributes: ['nama', 'nim', 'ownedAvatars', 'koin', 'point', 'profileAvatar'] }
            ]
        });

        if (friends.length > 0) {
            const formattedFriends = friends.map(friend => {
                // Check if friend.friendUser exists before accessing its properties
                const ownedAvatars = friend.friendUser ? JSON.parse(friend.friendUser.ownedAvatars || '[]') : [];
                
                return {
                    userId: friend.userId,
                    friendId: friend.friendId,
                    friendUserId: friend.friendUserId,
                    createdAt: friend.createdAt,
                    updatedAt: friend.updatedAt,
                    nama: friend.friendUser.nama,
                    nim: friend.friendUser.nim,
                    ownedAvatars: ownedAvatars,
                    koin: friend.friendUser.koin,
                    point: friend.friendUser.point,
                    profileAvatar: friend.friendUser.profileAvatar
                };
            });

            return res.json(formattedFriends);
        } else {
            return res.json([]);
        }
    } catch (error) {
        console.error(`Error fetching friends for userId ${userId}:`, error);
        res.status(500).json({ message: 'Failed to fetch friends' });
    }
});





// Endpoint untuk menghapus relasi teman berdasarkan friendId
router.delete('/:friendId', async (req, res) => {
    const friendId = req.params.friendId;

    try {
        const deletedFriend = await Friend.destroy({
            where: { friendId }
        });

        if (deletedFriend > 0) {
            res.json({ message: 'Friend relationship deleted successfully' });
        } else {
            res.status(404).json({ error: 'Friend relationship not found' });
        }
    } catch (error) {
        console.error('Error deleting friend relationship:', error);
        res.status(500).json({ error: 'Failed to delete friend relationship' });
    }
});

module.exports = router;
