import { Router } from "express";
import UsuariosController  from "../controller/UsuariosController";


const router = Router();

router.post('/create_usuario', UsuariosController.crearUsuario);
router.put('/edit_user/:id',UsuariosController.modificarUsuario);
router.get('/search_user/:id',UsuariosController.buscarUsuarioPorId);
router.get('/search_tod_user',UsuariosController.traerTodosLosUsuarios);
router.delete('/delete_user/:id',UsuariosController.eliminarUsuarioPorId);

export default router;