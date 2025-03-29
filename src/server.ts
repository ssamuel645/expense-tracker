import fastify from 'fastify';
import { env } from './env';
import { helloRoute } from './routes/hello';

const app = fastify();

app.register(helloRoute);

app.listen({
  port: env.PORT
}).then(() => {
  console.log('HTTP Server Running!');
});