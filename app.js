"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const tag_1 = require("./src/models-routes/tag");
const folder_1 = require("./src/models-routes/folder");
const document_1 = require("./src/models-routes/document");
const signed_url_1 = require("./src/aws/signed-url");
const signed_url_upload_1 = require("./src/aws/signed-url-upload");
const server = (0, fastify_1.default)();
server.register(signed_url_upload_1.uploadToS3);
server.register(signed_url_1.getSignedUrl);
server.register(document_1.documents);
server.register(folder_1.folders);
server.register(tag_1.tags);
server.get('/ping', async (request, reply) => {
    return 'pong\n';
});
server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
