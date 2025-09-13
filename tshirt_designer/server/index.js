import exprerss from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

import dalleRoutes from './routes/dalle.routes.js';

dotenv.config();

const app = exprerss();
app.use(cors());
app.use(exprerss.json({ limit: '50mb' }));

app.use('/api/v1/dalle', dalleRoutes);

app.get('/', (req, res) => {
  res.send('Hello from tshirt designer');
});

app.listen(8080, () => console.log('A szerver fut a 8080-as porton'));