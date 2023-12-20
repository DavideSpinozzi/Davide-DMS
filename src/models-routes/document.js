"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documents = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function documents(app) {
    app.post('/documents', async (request, reply) => {
        try {
            await verificaTag(request.body);
            await verificaFolder(request.body);
            const document = await prisma.document.create({
                data: request.body,
            });
            for (const folderID of request.body.folderIDs) {
                await prisma.folder.update({
                    where: { id: folderID },
                    data: {
                        documentIDs: {
                            push: document.id
                        }
                    }
                });
            }
            for (const tagID of request.body.tagIDs) {
                await prisma.tag.update({
                    where: { id: tagID },
                    data: {
                        documentIDs: {
                            push: document.id
                        }
                    }
                });
            }
            reply.send(document);
        }
        catch (error) {
            console.error('Errore nella creazione del documento:', error);
        }
    });
    app.get('/documents', async (request, reply) => {
        try {
            const documents = await prisma.document.findMany();
            reply.send(documents);
        }
        catch (error) {
            console.error('Errore nel recupero dei documenti:', error);
        }
    });
    app.get('/documents/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            const document = await prisma.document.findUnique({
                where: { id }
            });
            if (!document) {
                reply.code(404).send('Document non trovato');
                return;
            }
            reply.send(document);
        }
        catch (error) {
            console.error('Errore nel recupero del documento:', error);
        }
    });
    app.put('/documents/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            if (request.body.tagIDs) {
                verificaTag(request.body);
                for (const tagID of request.body.tagIDs) {
                    await prisma.tag.update({
                        where: { id: tagID },
                        data: {
                            documentIDs: {
                                push: id
                            }
                        }
                    });
                }
            }
            if (request.body.folderIDs) {
                await verificaFolder(request.body);
                for (const folderID of request.body.folderIDs) {
                    await prisma.folder.update({
                        where: { id: folderID },
                        data: {
                            documentIDs: {
                                push: id
                            }
                        }
                    });
                }
            }
            const updatedDocument = await prisma.document.update({
                where: { id },
                data: request.body,
            });
            reply.send(updatedDocument);
        }
        catch (error) {
            console.error('Errore nell\'aggiornamento del documento:', error);
        }
    });
    app.put('/documents/addTag/:id', async (request, reply) => {
        const { id } = request.params;
        const { tagId } = request.body;
        try {
            const existingTag = await prisma.tag.findUnique({ where: { id: tagId } });
            if (!existingTag) {
                throw new Error(`Il Tag non esiste`);
            }
            const updatedDocument = await prisma.document.update({
                where: { id },
                data: {
                    tagIDs: {
                        push: tagId,
                    },
                },
            });
            await prisma.tag.update({
                where: { id: tagId },
                data: {
                    documentIDs: {
                        push: id,
                    },
                },
            });
            reply.send(updatedDocument);
        }
        catch (error) {
            console.error('Errore nell\'aggiornamento del documento con il nuovo tag:', error);
        }
    });
    app.put('/documents/move/:id', async (request, reply) => {
        const { id } = request.params;
        const { folderId } = request.body;
        try {
            const existingFolder = await prisma.folder.findUnique({ where: { id: folderId } });
            if (!existingFolder) {
                throw new Error(`la Folder non esiste`);
            }
            const updatedDocument = await prisma.document.update({
                where: { id },
                data: { folderIDs: [folderId] },
            });
            await prisma.folder.update({
                where: { id: folderId },
                data: {
                    documentIDs: {
                        push: id
                    }
                }
            });
            reply.send(updatedDocument);
        }
        catch (error) {
            console.error('Errore nello spostamento del documento:', error);
        }
    });
    app.delete('/documents/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            await prisma.document.delete({
                where: { id },
            });
            reply.send("Nessun contenuto");
        }
        catch (error) {
            console.error('Errore nella cancellazione del documento:', error);
        }
    });
}
exports.documents = documents;
async function verificaTag(document) {
    for (const tagId of document.tagIDs) {
        const existingTag = await prisma.tag.findUnique({ where: { id: tagId } });
        if (!existingTag) {
            throw new Error(`il Tag non esiste`);
        }
    }
}
async function verificaFolder(document) {
    for (const folderId of document.folderIDs) {
        const existingFolder = await prisma.folder.findUnique({ where: { id: folderId } });
        if (!existingFolder) {
            throw new Error(`la Folder non esiste`);
        }
    }
}
