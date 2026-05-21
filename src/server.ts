import {
  createServer,
  IncomingMessage,
  Server,
  ServerResponse,
} from "node:http";
import { routeHandler } from "./routes/routes";
import config from "./config";

const server: Server = createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    // console.log(req.url); '/' , '/user', '/product',
    // console.log(req.method); 'Get', 'post' 'put', 'patch','delete'
    routeHandler(req, res);
  },
);

server.listen(config.port, () => {
  console.log(`server is running on port ${config.port}`);
});
