import { Router } from "express";
import auth from "./auth";
import guia from "./guia";
import users from "./users";
// import sesiones from "./sesiones";
import despliComp from "./despliComp"

const routes = Router();

routes.use('/auth', auth);
routes.use('/guia', guia);
routes.use('/users', users)
// routes.use('/sesiones', sesiones)
routes.use('/sync', despliComp)

export default routes;