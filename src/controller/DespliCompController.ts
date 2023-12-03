import { Request, Response } from "express";
import { getRepository} from "fireorm";
import Guias from "../entity/Guias";

class DespliegueComparacionController {
  async desplegarGuias(req: Request, res: Response) {
    try {
      const { ids } = req.body;
  
      if (!ids) {
        return res.status(400).json({ error: 'Faltan datos necesarios para modificar las guías.' });
      }
  
      // Convertir a cadena si no es una cadena
      const idList = typeof ids === 'string' ? ids.split(',') : ids;
  
      // Obtener el repositorio de FireORM para la entidad Guias
      const guiasRepository = getRepository(Guias);
  
      // Obtener todas las guías
      const todasGuias = await guiasRepository.find();
  
      // Obtener las guías existentes desde el repositorio
      const guiasExistente = await guiasRepository.whereIn('id', idList).find();
  
      if (!guiasExistente || guiasExistente.length === 0) {
        return res.status(404).json({ error: 'Guías no encontradas.' });
      }
  
      // Actualizar el estado de las guías seleccionadas
      await Promise.all(guiasExistente.map(async (guia) => {
        await guiasRepository.update({ ...guia, status: 'Activo' });
      }));
  
      // Actualizar el estado de las guías no seleccionadas a `status: false`
      const guiasNoSeleccionadas = todasGuias.filter(guia => !idList.includes(guia.id));
      await Promise.all(guiasNoSeleccionadas.map(async (guia) => {
        await guiasRepository.update({ ...guia, status: 'False' });
      }));
  
      return res.status(200).json({ mensaje: 'Despliegue realizado exitosamente.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }
  
}
export default new DespliegueComparacionController();