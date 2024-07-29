import express from 'express';
// fix dirname
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { methods as authentication } from './controllers/authentication.controller.js';
import { methods as authorization } from './middlewares/authorization.js';
import cookieParser from 'cookie-parser';

// server
const app = express();
app.set('port', 4000);
app.listen(app.get('port'));

console.log('Server running in port:', app.get('port'));

// conf
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(cookieParser());

// routes

// get
app.get('/', authorization.onlyPublic, (req, res) =>
  res.sendFile(__dirname + '/pages/home.html')
);
app.get('/register', authorization.onlyPublic, (req, res) =>
  res.sendFile(__dirname + '/pages/register.html')
);
app.get('/login', authorization.onlyPublic, (req, res) =>
  res.sendFile(__dirname + '/pages/login.html')
);
app.get('/admin', authorization.onlyAdmin, (req, res) =>
  res.sendFile(__dirname + '/pages/admin/admin.html')
);

// post
app.post('/api/register', authentication.register);
app.post('/api/login', authentication.login);
