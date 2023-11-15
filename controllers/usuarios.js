const { response , request} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt'); 



const usuariosGet = async(req = request, res = response) => {
    const { limit =5, desde = 0} = req.query;
    const query = {estado: true}

    //const usuario = await Usuario.find(query)
    //    .skip(desde)
    //    .limit(Number(limit))
    
    //const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limit)),
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPut = async(req, res= response) => {

    const id = req.params.id;
    const { password, google, correo, ...resto} = req.body;

    // TODO validar contra base de datos
    if(password){
        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync(password, salt);
    }   

    const usuario = await Usuario.findByIdAndUpdate(id,resto)

    res.json(usuario)
}
const usuariosPost =  async (req, res= response) => {
   

    const {nombre, correo, password, rol} = req.body;

    const usuario = new Usuario({nombre, correo, password, rol});

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        return res.status(400).json({
            msg: 'El correo ya está registrado'
        })
    }

    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(password, salt);

    // Guardar en BD
    await  usuario.save(); 

    res.json(usuario)
}
const usuariosDelete = async (req, res= response) => {

    const id = req.params.id;
    const usuario = await Usuario.findByIdAndUpdate(id,{estado: false})
    res.json(usuario)
   
}

const usuariosPatch = (req, res= response) => {
    res.json({ 
        msg: 'delete API - controlador'
    })
}



module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}