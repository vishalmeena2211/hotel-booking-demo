import express, { Request, Response } from 'express';
import router from './routes/route';
import cors from 'cors';


const app = express();
const port = 5000;

app.use(express.json());

app.use(cors({
    origin: 'https://hotel-booking-demo-ten.vercel.app',
}));

app.use('/api/v1', router);


app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});