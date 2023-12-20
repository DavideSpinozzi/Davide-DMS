import fastify from 'fastify'
import { tags } from './src/models-routes/tag';
import { folders } from './src/models-routes/folder';
import { documents } from './src/models-routes/document';
import { getSignedUrl } from './src/aws/signed-url';

const server = fastify()
server.register(getSignedUrl)
server.register(documents)
server.register(folders)
server.register(tags)

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
