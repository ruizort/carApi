import db from "../models/index.js";
import bcrypt from "bcrypt";
import UserServices from "../services/userServices.js";
const User = db.User;

class UserController {
  userServices = new UserServices();

  // --- 1. REGISTRO (Crear Usuario) ---
  register = () => this.userServices.register;

  // --- 2. LOGIN (Verificar Credenciales) ---
  login = () => this.userServices.login;

  // --- 3. OBTENER TODOS LOS USUARIOS (Para solucionar el error de rutas) ---
  getAllUsers = () => this.userServices.getAllUsers;
}

export default UserController;
