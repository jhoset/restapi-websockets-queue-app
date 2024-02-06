import { createServer } from 'http';
import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { WssService } from './presentation/services/wss.service';


(async () => {
  main();
})();


function main() {

  const expressWebServer = new Server({
    port: envs.PORT,
  });

  const httpServer = createServer(expressWebServer.app)
  WssService.initWss({ server: httpServer, path: '/ws' })
  expressWebServer.setRoutes(AppRoutes.routes);

  httpServer.listen(envs.PORT, () => {
    console.log("Server running on port", envs.PORT);
  })
}