import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import { initialize } from 'fireorm';  // Importa initialize desde fireorm
import routes from './routes';

const PORT = process.env.PORT || 5000;

// Configuración de Firebase
const serviceAccount = require('../credentials.json'); // Utiliza la ruta relativa al archivo desde tu script de Node.js

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://casac-db.firebaseio.com'
});

// Inicializa FireORM con la instancia de Firestore de Firebase Admin
initialize(admin.firestore());

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rutas
app.use('/', routes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
