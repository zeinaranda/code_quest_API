const express = require('express');
const router = express.Router();

// Daftar pengguna dan password
const users = {
    'adminA': { password: 'passA', kategori: 'A' },
    'adminB': { password: 'passB', kategori: 'B' }
};

// Endpoint untuk login
router.post('/', (req, res) => {
    const { username, password } = req.body;
    const user = users[username];

    if (user && user.password === password) {
        // Redirect berdasarkan kategori
        const redirectUrl = user.kategori === 'A' ? '/dataA.html' : '/dataB.html';
        res.json({ success: true, redirectUrl });
    } else {
        res.json({ success: false, message: 'Invalid username or password' });
    }
});

module.exports = router;
