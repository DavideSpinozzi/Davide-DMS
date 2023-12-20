import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import AWS from 'aws-sdk';

const prisma = new PrismaClient();
const s3 = new AWS.S3({
    accessKeyId: 'AKIAZ4SOIJYNJVJN4RHC',
    secretAccessKey: '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',
    region: 'eu-west-3'
  });

  export async function uploadToS3(app: FastifyInstance) {
    app.post('/upload/:id', async (request: FastifyRequest<{Params: {id : string}}>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const document = await prisma.document.findUnique({
          where: { id: id },
        });
        if (!document) {
          reply.code(404).send('Document non trovato');
          return;
        }
        const s3Key = `documents/${document.nome}`;
        const s3Params = {
          Bucket: 'davidedms',
          Key: s3Key,
          Body: Buffer.from(JSON.stringify(document), 'utf-8'),
        };
        await s3.upload(s3Params).promise();
        reply.send('File caricato su S3 con successo');
      } catch (error) {
        console.error('Errore nel caricamento del file su S3:', error);
      }
    });
  }