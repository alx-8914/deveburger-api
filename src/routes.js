import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import CategoryController from './app/controllers/CategoryController';
import UserController from './app/controllers/UserController';
import OrderController from './app/controllers/OrderController';
import CreatePaymentIntentController from './app/controllers/Stripe/CreatePaymentIntentController';

import authMiddleware from './database/middlewares/auth';

const upload = multer(multerConfig);

const routes = new Router();

routes.post('/users', UserController.store); //CADASTRO
routes.post('/sessions', SessionController.store); //LOGIN

routes.use(authMiddleware); //será chamado por todas as rotas ABAIXO

routes.post('/products', upload.single('file'), ProductController.store);
routes.get('/products', ProductController.index);
routes.put('/products/:id', upload.single('file'), ProductController.update);

routes.post('/categories',  upload.single('file'), CategoryController.store);
routes.get('/categories', CategoryController.index);
routes.put('/categories/:id', upload.single('file'), CategoryController.update);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);

routes.post("/create-payment-intent", CreatePaymentIntentController.store);

export default routes
//Poderoso middleware
// request -> middleware -> controller -> model -> Database -> response