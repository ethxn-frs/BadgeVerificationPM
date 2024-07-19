import express from 'express';
import {badgeRoute} from './controllers/badgeController';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

badgeRoute(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 