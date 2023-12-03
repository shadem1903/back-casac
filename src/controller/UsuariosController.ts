import { Request, Response } from 'express';
import { getRepository } from 'fireorm';
import Usuarios from '../entity/Usuarios';

class UsuariosController {
  async crearUsuario(req: Request, res: Response) {
    try {
      const {
        nombres,
        apellidos,
        correo,
        contrasena,
        identificacion,
        universidad,
        profesion,
        grupo_investigacion,
        rol,
        ultimo_acceso,
        status
      } = req.body;

      // Validar que se proporcionen los datos necesarios
      if (
        !nombres ||
        !apellidos ||
        !correo ||
        !contrasena ||
        !identificacion ||
        !universidad ||
        !profesion ||
        !grupo_investigacion ||
        !rol ||
        !ultimo_acceso ||
        !status
      ) {
        return res.status(400).json({ error: 'Faltan datos necesarios para crear el usuario.' });
      }

      // Crear el usuario
      const nuevoUsuario = new Usuarios();
      nuevoUsuario.nombres = nombres;
      nuevoUsuario.apellidos = apellidos;
      nuevoUsuario.correo = correo;
      nuevoUsuario.contrasena = contrasena; // Recuerda manejar adecuadamente las contraseñas en un entorno de producción
      nuevoUsuario.identificacion = identificacion;
      nuevoUsuario.universidad = universidad;
      nuevoUsuario.profesion = profesion;
      nuevoUsuario.grupo_investigacion = grupo_investigacion;
      nuevoUsuario.rol = rol;
      nuevoUsuario.ultimo_acceso = ultimo_acceso;
      nuevoUsuario.status = status;

      // Guardar el usuario en la base de datos
      await getRepository(Usuarios).create(nuevoUsuario);

      return res.status(201).json({ mensaje: 'Usuario creado exitosamente.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  async modificarUsuario(req: Request, res: Response) {
    try {
      const {
        id,
        nombres,
        apellidos,
        correo,
        contrasena,
        identificacion,
        universidad,
        profesion,
        grupo_investigacion,
        rol,
        ultimo_acceso,
        status
      } = req.body;

      // Validar que se proporcionen los datos necesarios
      if (!id || !nombres || !apellidos || !correo || !identificacion || !universidad || !profesion || !grupo_investigacion || !rol || !ultimo_acceso || !status) {
        return res.status(400).json({ error: 'Faltan datos necesarios para modificar el usuario.' });
      }

      // Verificar si el usuario existe
      const usuarioExistente = await getRepository(Usuarios).findById(id);

      if (!usuarioExistente) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      // Modificar el usuario
      usuarioExistente.nombres = nombres;
      usuarioExistente.apellidos = apellidos;
      usuarioExistente.correo = correo;
      usuarioExistente.identificacion = identificacion;
      usuarioExistente.universidad = universidad;
      usuarioExistente.profesion = profesion;
      usuarioExistente.grupo_investigacion = grupo_investigacion;
      usuarioExistente.rol = rol;
      usuarioExistente.ultimo_acceso = ultimo_acceso;
      usuarioExistente.status = status;

      // Si se proporciona una nueva contraseña, actualizarla (recuerda manejar adecuadamente las contraseñas)
      if (contrasena) {
        usuarioExistente.contrasena = contrasena;
      }

      // Guardar los cambios en la base de datos
      await getRepository(Usuarios).update(usuarioExistente);

      return res.status(200).json({ mensaje: 'Usuario modificado exitosamente.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  async buscarUsuarioPorId(req: Request, res: Response) {
    try {
      const { id } = req.params; // Suponiendo que el id del usuario se pasa como parámetro en la URL

      // Validar que se proporciona un ID válido
      if (!id) {
        return res.status(400).json({ error: 'Se requiere un ID válido para buscar el usuario.' });
      }

      // Consultar el usuario desde la base de datos
      const usuario = await getRepository(Usuarios).findById(id);

      // Verificar si el usuario existe
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      // Devolver el usuario consultado
      return res.status(200).json({ usuario });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }
  async  traerTodosLosUsuarios(req: Request, res: Response) {
    try {
      // Get all users from the database
      const usuarios = await getRepository(Usuarios).find();
  
      // Return the list of users
      return res.status(200).json({ usuarios });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  async eliminarUsuarioPorId(req: Request, res: Response) {
    try {
      const { id } = req.params; // Get the user ID from the request parameters
  
      // Validate that a valid ID is provided
      if (!id) {
        return res.status(400).json({ error: 'Se requiere un ID válido para eliminar el usuario.' });
      }
  
      // Check if the user exists
      const usuarioExistente = await getRepository(Usuarios).findById(id);
  
      if (!usuarioExistente) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
  
      // Delete the user from the database
      await getRepository(Usuarios).delete(id);
  
      return res.status(200).json({ mensaje: 'Usuario eliminado exitosamente.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }
}

export default new UsuariosController();
