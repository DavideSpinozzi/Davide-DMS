import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient, Folder } from '@prisma/client';

const prisma = new PrismaClient();

export async function folders(app: FastifyInstance) {
  
  app.post('/folders', async (request: FastifyRequest<{ Body: Folder }>, reply: FastifyReply) => {
    try {
      const folderData = request.body;
      let fullPath = '';
      
      if (folderData.folderMadreId) {
        const folderMadre = await prisma.folder.findUnique({
          where: { id: folderData.folderMadreId },
        });

        if (folderMadre) {
          fullPath = folderMadre.path;
        }
      }

      fullPath = `${fullPath}/${folderData.nome}`;
      
      const folder = await prisma.folder.create({
        data: {
          ...folderData,
          path: fullPath,
        },
      });
      reply.send(folder);
    } catch (error) {
      console.error('Errore nella creazione della cartella:', error);
    }
  });

  app.get('/folders', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const folders = await prisma.folder.findMany();
      reply.send(folders);
    } catch (error) {
      console.error('Errore nel recupero delle cartelle:', error);
    }
  });

  app.get('/folders/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    try {
      const folder = await prisma.folder.findUnique({
        where: { id }
      });
      if (!folder) {
        reply.code(404).send('Folder non trovata');
        return;
      }
      reply.send(folder);
    } catch (error) {
      console.error('Errore nel recupero della cartella:', error);
    }
  });

  app.put('/folders/:id', async (request: FastifyRequest<{ Params: { id: string }; Body: Folder }>, reply: FastifyReply) => {
    const { id } = request.params;
    const updateData = request.body as Partial<Folder>;

    try {
        const folder = await prisma.folder.findUnique({
            where: { id },
        });

        if (!folder) {
            reply.code(404).send('Folder non trovata');
            return;
        }

        let fullPath = folder.path;

        if (updateData.folderMadreId) {
            const folderMadre = await prisma.folder.findUnique({
                where: { id: updateData.folderMadreId },
            });

            if (folderMadre) {
                fullPath = folderMadre.path;
            }
        }

        const updatedFolder = await prisma.folder.update({
            where: { id },
            data: {
                ...updateData,
                path: fullPath + (updateData.nome ? `/${updateData.nome}` : `/${folder.nome}`),
            },
        });

        reply.send(updatedFolder);
    } catch (error) {
        console.error('Errore nell\'aggiornamento della cartella:', error);
    }
});


  app.delete('/folders/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    try {
      await prisma.folder.delete({
        where: { id },
      });
      reply.send("Nessun contenuto");
    } catch (error) {
      console.error('Errore nella cancellazione della cartella:', error);
    }
  });
}
