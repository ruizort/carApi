class UserController {
  constructor(service) {
    this.userServices = service;
  }

  // --- 1. REGISTRO (Crear Usuario) ---
  register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
      const result = await this.userServices.registerUser({
        name,
        email,
        password,
        role,
      });
      // Manejo de errores del service
      if (result.error === "EMAIL_EXISTS") {
        return res
          .status(409)
          .send({ message: "El correo ya está registrado." });
      }

      return res.status(201).send(result);
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      return res
        .status(500)
        .send({ message: "Error interno al registrar el usuario." });
    }
  };

  // --- 2. LOGIN (Verificar Credenciales) ---
  login = async (req, res) => {
    const { email, password } = req.body;
    try {
      // 1. Buscar el usuario por email
      const result = await this.userServices.loginUser({ email, password });

      if (result.error === "EMAIL_INVALID") {
        return res.status(401).send({ message: "Credenciales inválidas." });
      }

      if (result.error === "PASSWORD_WRONG") {
        return res.status(401).send({ message: "Credenciales inválidas." });
      }

      // 3. Login exitoso: Responder con los datos (sin la contraseña/hash)
      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send({ message: "Error interno del servidor." });
    }
  };

  // --- 3. OBTENER TODOS LOS USUARIOS (Para solucionar el error de rutas) ---
  getAllUsers = async (req, res) => {
    try {
      const result = await this.userServices.getAllUsersService();
      if (result.message === "Error interno al recuperar usuarios.") {
        return res
          .status(500)
          .send({ message: "Error interno al recuperar usuarios." });
      }
      return res.status(200).send(result);
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Error interno al recuperar usuarios." });
    }
  };
}

export default UserController;
