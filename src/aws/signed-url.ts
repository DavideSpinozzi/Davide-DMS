import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import AWS from 'aws-sdk';

const prisma = new PrismaClient();
const s3 = new AWS.S3({
    accessKeyId: 'AKIAZ4SOIJYNJVJN4RHC',
    secretAccessKey: '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',
    region: 'eu-west-3'
  });

export async function getSignedUrl(app: FastifyInstance) {
  app.get('/signed-url', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      
      const s3Params = {
        Bucket: 'davidedms',
        Key: 'documents/documento con collegamenti',
        Expires: 180,
      };

      const signedUrl = await s3.getSignedUrlPromise('getObject', s3Params);

      reply.send({ signedUrl });
    } catch (error) {
      console.error('Errore nel recupero dell\'URL firmato:', error);
    }
  });
}
