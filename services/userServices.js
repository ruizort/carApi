import db from "../models/index.js";
import bcrypt from "bcrypt";

const User = db.User;

class UserServices {
  // Configuración para el hashing (número de rondas de seguridad)
  saltRounds = 10;

  // --- 1. REGISTRO (Crear Usuario) ---
  registerUser = async ({ name, email, password, role }) => {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return { error: "EMAIL_EXISTS" };
    }

    // 1. Hashear la contraseña por seguridad
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    // 2. Crear el nuevo usuario en la DB
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // Guardar el hash
      role: role || "user", // Por defecto es 'user'
    });

    // 3. Responder con el usuario creado (sin la contraseña)
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      message: "Usuario registrado exitosamente.",
    };
  };

  // --- 2. LOGIN (Verificar Credenciales) ---
  loginUser = async ({ email, password }) => {
    console.log("------------------------------------------------");
    console.log("🔍 DEBUG LOGIN:");
    console.log("1. Email recibido:", email);
    console.log("2. Password recibida:", password);

    try {
      // 1. Buscar el usuario por email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return { error: "EMAIL_INVALID" };
      }
      // 2. Comparar la contraseña ingresada con el hash de la DB
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return { error: "PASSWORD_WRONG" };
      }

      // 3. Login exitoso: Responder con los datos (sin la contraseña/hash)
      console.log("✅ Login Exitoso");

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: "Inicio de sesión exitoso.",
      };
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return { message: "Error interno del servidor." };
    }
  };

  // --- 3. OBTENER TODOS LOS USUARIOS (Para solucionar el error de rutas) ---
  getAllUsersService = async () => {
    try {
      const users = await User.findAll({
        // Seleccionamos solo los campos seguros (excluyendo la contraseña)
        attributes: ["id", "name", "email", "role", "createdAt"],
      });

      return users;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return { message: "Error interno al recuperar usuarios." };
    }
  };
}

export default UserServices;
