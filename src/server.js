import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

app.listen(3001, () => console.log('😎🚀💻Server is running at port 3001...'));