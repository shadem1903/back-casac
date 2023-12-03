import { Request, Response } from "express";
import * as admin from "firebase-admin";

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { correo, contrasena } = req.body;

      if (!correo || !contrasena) {
        return res
          .status(400)
          .json({ error: "Faltan datos necesarios para iniciar sesión." });
      }

      // Buscar en la colección de Usuarios
      const usuariosRef = admin.firestore().collection("Usuarios");
      const query = usuariosRef
        .where("correo", "==", correo)
        .where("contrasena", "==", contrasena);
      const snapshot = await query.get();

      // Verificar si se encontró un usuario
      if (snapshot.empty) {
        return res
          .status(401)
          .json({ error: "Correo o contraseña incorrectos." });
      }

      // Obtener los datos del primer usuario encontrado (asumimos que el correo es único)
      const usuarioData = snapshot.docs[0].data();

      // Puedes realizar verificaciones adicionales aquí si es necesario

      return res.status(200).json({
        mensaje: "Inicio de sesión exitoso",
        usuario: {
          uid: snapshot.docs[0].id,
          correo: usuarioData.correo,
          // Agrega otros campos del usuario que necesites
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }

  async recuperarContrasena(req: Request, res: Response) {
    try {
      const { correo, identificacion, nuevaContrasena } = req.body;

      if (!correo || !identificacion || !nuevaContrasena) {
        return res
          .status(400)
          .json({
            error: "Faltan datos necesarios para recuperar la contraseña.",
          });
      }

      // Validar que el correo y la identificación coincidan con un usuario en tu base de datos
      // Esto es solo un ejemplo, deberías adaptarlo según tu estructura de datos
      const usuarioExistente = await admin
        .firestore()
        .collection("Usuarios")
        .where("correo", "==", correo)
        .where("identificacion", "==", identificacion)
        .get();

      if (usuarioExistente.empty) {
        return res
          .status(400)
          .json({
            error:
              "No se encontró un usuario con el correo e identificación proporcionados.",
          });
      }

      // Cambiar la contraseña del usuario
      const [usuario] = usuarioExistente.docs;
      await admin.auth().updateUser(usuario.id, { password: nuevaContrasena });

      return res
        .status(200)
        .json({ mensaje: "Contraseña cambiada exitosamente." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
}

export default new AuthController();
