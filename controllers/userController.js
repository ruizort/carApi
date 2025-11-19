// src/controllers/userController.js

const db = require('../models');
const User = db.User;
const bcrypt = require('bcrypt');

// Configuración para el hashing (número de rondas de seguridad)
const saltRounds = 10; 

// --- 1. REGISTRO (Crear Usuario) ---
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).send({ message: "El correo ya está registrado." });
        }

        // 1. Hashear la contraseña por seguridad
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 2. Crear el nuevo usuario en la DB
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword, // Guardar el hash
            role: role || 'user'     // Por defecto es 'user'
        });

        // 3. Responder con el usuario creado (sin la contraseña)
        res.status(201).send({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            message: "Usuario registrado exitosamente."
        });

    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).send({ message: "Error interno al registrar el usuario." });
    }
};

// --- 2. LOGIN (Verificar Credenciales) ---
exports.login = async (req, res) => {
    const { email, password } = req.body;

    console.log("------------------------------------------------");
    console.log("🔍 DEBUG LOGIN:");
    console.log("1. Email recibido:", email);
    console.log("2. Password recibida:", password);

    try {
        // 1. Buscar el usuario por email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).send({ message: "Credenciales inválidas." });
        }
        console.log("✅ Login Exitoso");
        // 2. Comparar la contraseña ingresada con el hash de la DB
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send({ message: "Credenciales inválidas." });
        }

        // 3. Login exitoso: Responder con los datos (sin la contraseña/hash)
        res.status(200).send({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            message: "Inicio de sesión exitoso."
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
};

// --- 3. OBTENER TODOS LOS USUARIOS (Para solucionar el error de rutas) ---
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            // Seleccionamos solo los campos seguros (excluyendo la contraseña)
            attributes: ['id', 'name', 'email', 'role', 'createdAt']
        });
        
        res.status(200).send(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).send({ message: "Error interno al recuperar usuarios." });
    }
};