"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedUrl = void 0;
const client_1 = require("@prisma/client");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const prisma = new client_1.PrismaClient();
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: 'AKIAZ4SOIJYNJVJN4RHC',
    secretAccessKey: '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',
    region: 'eu-west-3'
});
async function getSignedUrl(app) {
    app.get('/signed-url', async (request, reply) => {
        try {
            const s3Params = {
                Bucket: 'davidedms',
                Key: 'documents/documento con collegamenti',
                Expires: 180,
            };
            const signedUrl = await s3.getSignedUrlPromise('getObject', s3Params);
            reply.send({ signedUrl });
        }
        catch (error) {
            console.error('Errore nel recupero dell\'URL firmato:', error);
        }
    });
}
exports.getSignedUrl = getSignedUrl;
