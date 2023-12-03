import { Request, Response } from "express";
import { getRepository } from "fireorm";
import Sesiones from "../entity/sesiones/Sesiones";
import Guias from "../entity/Guias";

class SesionesController {
  async crearSesion(req: Request, res: Response) {
    try {
      const { sesiones } = req.body;

      if (!sesiones || !Array.isArray(sesiones) || sesiones.length === 0) {
        return res.status(400).json({
          error: 'El formato del cuerpo de la solicitud es incorrecto. Se esperan sesiones.',
        });
      }

      const nuevasSesiones = [];

      for (const sesionData of sesiones) {
        const { pertenece_a, sesion } = sesionData;

        if (!pertenece_a || !sesion || !sesion.length) {
          return res.status(400).json({
            error: 'El formato del cuerpo de la solicitud es incorrecto. Se esperan datos de sesión.',
          });
        }

        const guiaExistente = await getRepository(Guias).whereEqualTo('titulo_guia', pertenece_a).findOne();

        if (!guiaExistente) {
          return res.status(400).json({ error: 'La guía especificada no existe.' });
        }

        const preguntas = sesion[0].preguntas.map((pregunta) => {
          return {
            tipo: pregunta.tipo,
            titulo_pregunta: pregunta.titulo_pregunta,
            respuestas: pregunta.respuestas.map((respuesta) => {
              return {
                respuesta: respuesta.respuesta,
              };
            }),
          };
        });

        nuevasSesiones.push({
          pertenece_a: guiaExistente.id,
          sesion: {
            titulo_sesion: sesion[0].titulo_sesion,
            preguntas: preguntas,
          },
        });
      }

      await getRepository(Sesiones).create(nuevasSesiones);

      return res.status(201).json({ mensaje: 'Sesiones creadas exitosamente.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  async modificarSesion(req: Request, res: Response) {
    try {
      const { id } = req.params; // Obtener el ID de los parámetros de la URL
      const { sesiones } = req.body;

      if (!id || !sesiones || !sesiones.length) {
        return res.status(400).json({
          error: "El formato del cuerpo de la solicitud es incorrecto.",
        });
      }

      // Verificar si la guía existe
      const { pertenece_a } = sesiones[0];
      const guiaExistente = await getRepository(Guias)
        .whereEqualTo("titulo_guia", pertenece_a) // Reemplaza "titulo_guia" con el nombre real del campo de título en tu modelo
        .findOne();

      if (!guiaExistente) {
        return res
          .status(400)
          .json({ error: "La guía especificada no existe." });
      }

      // Obtener el repositorio de FireORM para la entidad Guias
      const sesionesRepository = getRepository(Sesiones);

      // Actualizar sesiones en la base de datos
      for (const sesionData of sesiones) {
        const sesionExistente = await sesionesRepository.findById(id);
        // Verificar si la sesión existe

        if (!sesionExistente) {
          return res
            .status(400)
            .json({ error: "La sesión especificada no existe." });
        }

        const sesionActualizada: any = {
          pertenece_a: guiaExistente.id,
          sesion: sesionData.sesion.map((sesion) => {
            const nuevaSesion: any = {
              titulo_sesion: sesion.titulo_sesion,
              preguntas: sesion.preguntas.map((pregunta) => {
                const nuevaPregunta: any = {
                  tipo: pregunta.tipo,
                  titulo_pregunta: pregunta.titulo_pregunta,
                  respuestas: pregunta.respuestas.map((respuesta) => {
                    const nuevaRespuesta: any = {
                      respuesta: respuesta.respuesta,
                    };
                    return nuevaRespuesta;
                  }),
                };
                return nuevaPregunta;
              }),
            };
            return nuevaSesion;
          }),
        };

        // Actualizar la sesión en la base de datos
        await sesionesRepository.update({
          id: id,
          ...sesionActualizada,
        });
      }

      return res
        .status(200)
        .json({ mensaje: "Sesiones modificadas exitosamente." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }

  async buscarSesionPorId(req: Request, res: Response) {
      /* try {
        const { id } = req.params;
  
        if (!id) {
          return res.status(400).json({
            error: 'El formato de la solicitud es incorrecto. Falta el ID de la sesión.',
          });
        }
  
        // Obtén el repositorio para la entidad Sesiones
        const sesionesRepository = getRepository(Sesiones);
  
        // Busca las sesiones que coinciden con el id proporcionado en la propiedad pertenece_a
        const sesionesEncontradas = await sesionesRepository
          .whereEqualTo('pertenece_a', id)
          .find();
  
        // Verifica si se encontraron sesiones y responde en consecuencia
        if (sesionesEncontradas.length > 0) {
          return res.status(200).json({
            sesiones: sesionesEncontradas,
          });
        } else {
          return res.status(404).json({
            error: 'No se encontraron sesiones con el ID proporcionado.',
          });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          error: 'Error interno del servidor.',
        });
      } */
      return true;
  }

  async eliminarSesion(req: Request, res: Response) {
    try {
      const { id } = req.params; // Suponiendo que el id de la sesión se pasa como parámetro en la URL

      // Validar que se proporciona un ID válido
      if (!id) {
        return res
          .status(400)
          .json({ error: "Se requiere un ID válido para eliminar la sesión." });
      }

      // Verificar si la sesión existe
      const sesionExistente = await getRepository(Sesiones).findById(id);

      if (!sesionExistente) {
        return res.status(404).json({ error: "Sesión no encontrada." });
      }

      // Eliminar la sesión desde la base de datos
      await getRepository(Sesiones).delete(id);

      return res
        .status(200)
        .json({ mensaje: "Sesión eliminada exitosamente." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
}

export default new SesionesController();
