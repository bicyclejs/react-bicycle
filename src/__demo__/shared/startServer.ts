import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import BicycleServer from 'bicycle/server';
const browserify = require('browserify-middleware');

export default function startServer(
  bicycle: BicycleServer<any>,
  client: string,
) {
  const app = express();

  app.get('/', (req, res, next) => {
    res.sendFile(path.resolve('demo/index.html'));
  });

  const baseCss = fs.readFileSync(require.resolve('todomvc-common/base.css'));
  const appCss = fs.readFileSync(require.resolve('todomvc-app-css/index.css'));
  app.get('/style.css', (req, res, next) => {
    res.type('css');
    res.send(baseCss + '\n' + appCss);
  });

  app.get('/client.js', browserify(client));

  app.use(
    '/bicycle',
    bicycle.createMiddleware(req => ({user: (req as any).user})),
  );

  // TODO: use this capability to actually do server side rendering
  const serverRenderer = bicycle.createServerRenderer(
    req => ({user: (req as any).user}),
    client => {
      return client.queryCache({
        todos: {id: true, title: true, completed: true},
      }).result;
    },
  );
  serverRenderer({user: {user: 'my user'}} as any, {} as any)
    .then(result => {
      console.log('server renderer result');
      console.dir(result, {depth: 10, colors: true});
    })
    .catch(ex => {
      console.error(ex);
      process.exit(1);
    });

  app.listen(3000);
}
