"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = void 0;
const client_1 = require("@prisma/client");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const prisma = new client_1.PrismaClient();
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: 'AKIAZ4SOIJYNJVJN4RHC',
    secretAccessKey: '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',
    region: 'eu-west-3'
});
async function uploadToS3(app) {
    app.post('/upload/:id', async (request, reply) => {
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
        }
        catch (error) {
            console.error('Errore nel caricamento del file su S3:', error);
        }
    });
}
exports.uploadToS3 = uploadToS3;
