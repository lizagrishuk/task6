export default (express, bodyParser, createReadStream, crypto, http) => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
    next();
  });

  app.use((req, res, next) => {
    if (!req.path.endsWith('/')) {
      return res.redirect(301, req.path + '/' + (req.search || ''));
    }
    next();
  });

  app.get('/login/', (req, res) => {
    res.send('lizagrishuk');
  });

  app.get('/code/', (req, res) => {
    const filePath = import.meta.url.substring(7);
    createReadStream(filePath).pipe(res);
  });

  app.get('/sha1/:input/', (req, res) => {
    const hash = crypto.createHash('sha1').update(req.params.input).digest('hex');
    res.send(hash);
  });

  app.get('/req/', (req, res) => {
    const addr = req.query.addr;
    http.get(addr, (response) => {
      response.pipe(res);
    });
  });

  app.post('/req/', (req, res) => {
    const addr = req.query.addr || req.body.addr;
    http.get(addr, (response) => {
      response.pipe(res);
    });
  });

  app.all('*', (req, res) => {
    res.send('lizagrishuk');
  });

  return app;
};