import express from 'express';
import bodyParser from 'body-parser';
import env from 'dotenv';
import path from 'path';
import routes from './routes/routes';

env.config();
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, '../node_modules/jquery/dist')));
// app.use(express.static(__dirname + '../public'));


// Middlewares used
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
//     next();
// });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'access-control-allow-methods,access-control-allow-origin,x-access-token,content-type,Origin, X-Requested-With, Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// app.get('/', (req, res) => {
//     res.status(200);
//     res.sendFile(path.join(__dirname, '/../templates/index.html'));

// });

// app.get('/signin', (req, res) => {
//     res.status(200);
//     res.sendFile(path.join(__dirname, '/../templates/sign_in.html'));
// });

// app.get('/signup', (req, res) => {
//     res.status(200);
//     res.sendFile(path.join(__dirname, '/../templates/sign_up.html'));
// });

app.use('/api/', routes);
app.use('/api/', (req, res) => {
    res.status(404);
    res.json({ msg: 'Page not found' });
});


app.listen(port, () => console.log(`Listening on port ${port} in ${app.get('env')}`));
export default app;