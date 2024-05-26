const {User} = require('../models')

exports.registerUser = async (req,res) => {
    try {
        let{nim, nama, password, passwordConfirm} = req.body

        if(password != passwordConfirm){
            return res.status(400).json({
                message: "Password tidak sama"
            })
        }

        const newUser = await User.create({
            nim,
            nama,
            password,
            
        })

        return res.status(201).json({
            message: "User berhasil ditambahkan",
            data: newUser
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Validasi Error",
            error
        })
    }
}