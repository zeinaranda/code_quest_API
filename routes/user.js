var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {User, Storytelling, Avatar} = require('../models');
const { route } = require('./userstage');

const v = new Validator();


// Register Route
router.post('/register', async (req, res) => {
    const { nim, nama, password } = req.body;
    try {
      // Check if nim already exists
      const existingUser = await User.findOne({ where: { nim } });
      if (existingUser) {
        return res.status(400).json({ error: 'NIM already exists' });
      }


      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        nim,
        nama,
        password: hashedPassword,
        ownedAvatars: [1,2,3], 
        koin: 0,
        firstLogin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);  // Log the error to see what went wrong
      res.status(500).json({ error: 'Failed to register user' });
    }
  });
  

  // Login Route

  router.post('/login', async (req, res) => {
    const { nim, password } = req.body;
    console.log(`Attempting to log in user: ${nim}`);
  
    try {
      const user = await User.findOne({ where: { nim } });
      if (!user) {
        console.log('User not found:', nim);
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('Invalid password for user:', nim);
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      console.log(`First login status for user ${nim}: ${user.firstLogin}`);
  
      let showStorytelling = false;
      let storytellingText = '';
      let avatarName = '';
      let imageAvatar = '';
  
      if (user.firstLogin) {
        console.log(`User's first login: ${nim}, current coins: ${user.koin}`);
        user.koin += 1000;
        user.point += 100;
        showStorytelling = true;
  
        // Fetch storytelling content
      const storytelling = await Storytelling.findOne({ where: { codeScene: 'prolog' } }); // Adjust condition as needed
      if (storytelling) {
        storytellingText = storytelling.text;

        // Fetch avatar information
        const avatar = await Avatar.findOne({ where: { avatarId: storytelling.avatarId } });
        if (avatar) {
          avatarName = avatar.avatarName;
          imageAvatar = avatar.imageAvatar;
        }
      }
  
        await user.save();
        console.log(`Coins updated for user: ${nim}, new coins: ${user.koin}`);
      } else {
        console.log(`User ${nim} has already logged in before, no coins awarded.`);
      }
  
      const token = jwt.sign({ userId: user.userId, nim: user.nim }, 'your_jwt_secret_key', { expiresIn: '1h' });
      console.log('User logged in successfully:', nim);
  
      const responseData = {
        token,
        nim: user.nim,
        nama: user.nama,
        userId: user.userId,
        point: user.point || 0,
        koin: user.koin,
        profileAvatar: user.profileAvatar,
        ownedAvatars: Array.isArray(user.ownedAvatars) ? user.ownedAvatars : JSON.parse(user.ownedAvatars), // Ensure it is an array        showStorytelling,
        storytellingText,
        avatarName,
        imageAvatar,
        firstLogin : user.firstLogin
      };
  
      res.json(responseData);
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Failed to login user' });
    }
  });


  router.put('/updateFirstLoginStatus', async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (user) {
            user.firstLogin = false;
            await user.save();
            res.status(200).json({ message: 'First login status updated' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating first login status:', error);
        res.status(500).json({ message: 'Failed to update first login status' });
    }
});


router.get('/', async(req, res) => {
    const user = await User.findAll();
    return res.json(user);
});


router.get('/top-users', async (req, res) => {
  try {
      const topUsers = await User.findAll({
          order: [['point', 'DESC']],
          limit: 10 // Mengambil 10 pengguna teratas
      });

      // Pastikan ownedAvatars selalu berupa array
      const usersWithArray = topUsers.map(user => {
          let ownedAvatars = user.ownedAvatars || [];
          if (typeof ownedAvatars === 'string') {
              ownedAvatars = JSON.parse(ownedAvatars);
          }
          return {
              ...user.toJSON(),
              ownedAvatars
          };
      });

      res.json(usersWithArray);
  } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
  }
});


router.get('/:userId', async(req, res) => {
  const userId = req.params.userId;
  try {
      const user = await User.findByPk(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Konversi string 'ownedAvatars' menjadi array jika perlu
      let ownedAvatars = user.ownedAvatars || [];
      if (typeof ownedAvatars === 'string') {
          ownedAvatars = JSON.parse(ownedAvatars);
      }

      // Ubah format tanggal agar sesuai dengan yang diminta
      const formattedCreatedAt = user.createdAt.toISOString();
      const formattedUpdatedAt = user.updatedAt.toISOString();

      // Buat respons dengan format yang diinginkan
      const responseData = {
          userId: user.userId,
          nim: user.nim,
          nama: user.nama,
          password: user.password,
          createdAt: formattedCreatedAt,
          koin: user.koin,
          point: user.point,
          profileAvatar: user.profileAvatar,
          updatedAt: formattedUpdatedAt,
          ownedAvatars: ownedAvatars
      };

      res.json(responseData);
  } catch (error) {
      console.error('Error retrieving user:', error);
      res.status(500).json({ message: 'Failed to retrieve user' });
  }
});

router.put('/:userId/profile/image', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { imageUri } = req.body;

  if (!imageUri) {
    return res.status(400).json({ error: 'imageUri is required' });
  }

  try {
    // Find the user by userId
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the profileAvatar field
    await user.update({ profileAvatar: imageUri });

    res.status(200).json({ message: 'Profile image updated successfully' });
  } catch (error) {
    console.error('Error updating profile image:', error);
    res.status(500).json({ error: 'Failed to update profile image' });
  }
});

router.post('/', async (req, res) => {
    const schema = {
        nim: 'string',
        nama: 'string',
        password: 'string'
    }

    const validate = v.validate(req.body, schema);

    if (validate.length) {
        return res
        .status(400)
        .json(validate);
    }

    const user = await User.create(req.body);

    res.json(user);
});


router.post('/addOwnedAvatar/:userId', async (req, res) => {
  const { userId } = req.params;  // Ambil userId dari path parameter
  const { avatarId } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 1, message: 'User not found' });
    }

    // Mengambil daftar ownedAvatars dari pengguna dan mengonversi dari JSON ke array
    let ownedAvatars = user.ownedAvatars ? JSON.parse(user.ownedAvatars) : [];

    console.log('Before adding avatar, ownedAvatars:', ownedAvatars);

    // Memeriksa apakah avatar sudah dimiliki oleh pengguna
    if (!ownedAvatars.includes(avatarId)) {
      // Jika belum dimiliki, tambahkan avatar ke daftar ownedAvatars
      ownedAvatars.push(avatarId);

      // Simpan perubahan ke database tanpa mengonversi ke JSON
      await user.update({ ownedAvatars });

      console.log('After adding avatar, ownedAvatars:', ownedAvatars);

      // Beri respons bahwa avatar berhasil ditambahkan
      return res.status(200).json({ error: 0, message: 'Avatar added successfully', ownedAvatars });
    }

    // Jika avatar sudah dimiliki, kirim respons bahwa avatar sudah dimiliki
    return res.status(200).json({ error: 0, message: 'Avatar already owned', ownedAvatars });
  } catch (error) {
    console.error('Error updating owned avatars:', error);
    return res.status(500).json({ error: 1, message: 'Failed to add avatar to owned list' });
  }
});









router.put('/:userId', async (req, res) => {
    const userId = req.params.userId;

    let user = await User.findByPk(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const schema = {
        nim: 'string|optional',
        nama: 'string|optional',
        password: 'string|optional',
        point: 'number|optional',
        koin: 'number|optional',
        ownedAvatars: { type: "array", items: "number", optional: true }
    };

    // Log the request body for debugging
    console.log("Request body before validation:", req.body);

    // Convert koin to number if it's a string
    if (req.body.koin && typeof req.body.koin === 'string') {
        req.body.koin = Number(req.body.koin);
    }

    const validate = v.validate(req.body, schema);

    if (validate.length) {
        return res.status(400).json(validate);
    }

    // Handle password hashing if password is being updated
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Konversi string 'ownedAvatars' menjadi array jika perlu
    let ownedAvatars = req.body.ownedAvatars || [];
    if (typeof ownedAvatars === 'string') {
        ownedAvatars = JSON.parse(ownedAvatars);
    }

    // Update data pengguna
    user = await user.update({ ...req.body, ownedAvatars });

    res.json(user);
});

// router.put('/:userId', async (req, res) => {
// const userId = req.params.userId;

// let user = await User.findByPk(userId);

// if (!user) {
//     return res.json({ message: 'User not found'});
// }

// const schema = {
//     nim: 'string|optional',
//     nama: 'string|optional',
//     password: 'string|optional',
//     point : 'number|optional',
//     koin : 'number|optional'
// }

// const validate = v.validate(req.body, schema);

// if (validate.length) {
//     return res
//     .status(400)
//     .json(validate);
// }
// user = await user.update(req.body);
// res.json(user);
// });

router.delete('/:userId', async(req, res) => {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);

    if (!user) {
        return res.json({ message: 'User not found'});
}
await user.destroy();
res.json({
    message: 'User deleted'
});

});

module.exports = router;