import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from '../src/config/connectdb.js';
import userRoute from '../src/routes/userRoute.js';
import router from './routes/adminRoute.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

connectDB()

const app = express();
const port = process.env.PORT || 3001;


app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/',userRoute);
app.use('/admin',router)


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});