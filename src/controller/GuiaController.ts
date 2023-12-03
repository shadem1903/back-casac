// En tu controlador o donde manejes las rutas
import { Request, Response } from "express";
import { getRepository} from "fireorm";
import Guias from "../entity/Guias";
class GuiaController {
  async crearGuia(req: Request, res: Response) {
    try {
      const {
        titulo_guia,
        descripcion,
        fecha_creacion,
        fecha_modificacion,
        status,
      } = req.body;

      // Validar que se proporcionen los datos necesarios
      if (
        !titulo_guia ||
        !descripcion ||
        !fecha_creacion ||
        !fecha_modificacion ||
        !status
      ) {
        return res
          .status(400)
          .json({ error: "Faltan datos necesarios para crear la guía." });
      }

      // Crear la guía
      const nuevaGuia = new Guias();
      nuevaGuia.titulo_guia = titulo_guia;
      nuevaGuia.descripcion = descripcion;
      nuevaGuia.fecha_creacion = fecha_creacion;
      nuevaGuia.fecha_modificacion = fecha_modificacion;
      nuevaGuia.status = status;

      // Guardar la guía en la base de datos
      await getRepository(Guias).create(nuevaGuia);

      return res.status(201).json({ mensaje: "Guía creada exitosamente." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }

  async modificarGuia(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { titulo_guia, descripcion, fecha_modificacion, status } = req.body;

      if (!id || !titulo_guia || !descripcion || !fecha_modificacion || !status) {
        return res.status(400).json({ error: 'Faltan datos necesarios para modificar la guía.' });
      }

      // Obtener el repositorio de FireORM para la entidad Guias
      const guiasRepository = getRepository(Guias);

      // Obtener la guía existente desde el repositorio
      const guiaExistente = await guiasRepository.findById(id);

      if (!guiaExistente) {
        return res.status(404).json({ error: 'Guía no encontrada.' });
      }

      // Actualizar los campos de la guía
      guiaExistente.titulo_guia = titulo_guia;
      guiaExistente.descripcion = descripcion;
      guiaExistente.fecha_modificacion = fecha_modificacion;
      guiaExistente.status = status;

      // Guardar los cambios en la base de datos
      await guiasRepository.update(guiaExistente);

      return res.status(200).json({ mensaje: 'Guía modificada exitosamente.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  async consultarGuia(req: Request, res: Response) {
    try {
      const { id } = req.params; // Suponiendo que el id de la guía se pasa como parámetro en la URL

      // Validar que se proporciona un ID válido
      if (!id) {
        return res
          .status(400)
          .json({ error: "Se requiere un ID válido para consultar la guía." });
      }

      // Consultar la guía desde la base de datos
      const guia = await getRepository(Guias).findById(id);

      // Verificar si la guía existe
      if (!guia) {
        return res.status(404).json({ error: "Guía no encontrada." });
      }

      // Devolver la guía consultada
      return res.status(200).json({ guia });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }

  async eliminarGuia(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ error: "Se requiere un ID válido para eliminar la guía." });
      }

      // Attempt to delete the guía from the database
      await getRepository(Guias).delete(id);

      // Check if the guía was deleted successfully
      // Fireorm delete() does not provide information about the affected rows, so assume success if no error is thrown
      return res.status(200).json({ mensaje: "Guía eliminada exitosamente." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }

  async listarGuias(req: Request, res: Response) {
    try {
      // Obtener todas las guías desde la base de datos
      const guias = await getRepository(Guias).find();

      // Devolver la lista de guías
      return res.status(200).json({ guias });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }

  async listarGuiasActivas(req: Request, res: Response) {
    try {
      // Obtener las guías con estado "Activo" desde la base de datos
      const guiasActivas = await getRepository(Guias).whereEqualTo("status", "Activo").find();
  
      // Devolver la lista de guías activas
      return res.status(200).json({ guiasActivas });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
}

export default new GuiaController();
