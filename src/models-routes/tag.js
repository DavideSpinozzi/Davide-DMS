"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tags = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function tags(app) {
    app.post('/tags', async (request, reply) => {
        console.log(request.body);
        try {
            const tag = await prisma.tag.create({
                data: request.body
            });
            reply.send(tag);
        }
        catch (error) {
            console.error('Errore nella creazione del tag:', error);
        }
    });
    app.get('/tags', async (request, reply) => {
        try {
            const tags = await prisma.tag.findMany();
            reply.send(tags);
        }
        catch (error) {
            console.error('Errore nel recupero dei tag:', error);
        }
    });
    app.get('/tags/:id', async (request, reply) => {
        const tagId = request.params.id;
        try {
            const tag = await prisma.tag.findUnique({
                where: { id: tagId },
            });
            if (!tag) {
                reply.status(404).send({ error: 'Tag non trovato' });
                return;
            }
            reply.send(tag);
        }
        catch (error) {
            console.error('Errore nel recupero del tag:', error);
        }
    });
    app.put('/tags/:id', async (request, reply) => {
        const tagId = request.params.id;
        const updateData = request.body;
        try {
            const updatedTag = await prisma.tag.update({
                where: { id: tagId },
                data: updateData,
            });
            reply.send(updatedTag);
        }
        catch (error) {
            console.error('Errore nell\'aggiornamento del tag:', error);
        }
    });
    app.delete('/tags/:id', async (request, reply) => {
        const tagId = request.params.id;
        try {
            await prisma.tag.delete({
                where: { id: tagId },
            });
            reply.send("Nessun contenuto");
        }
        catch (error) {
            console.error('Errore nell\'eliminazione del tag:', error);
        }
    });
}
exports.tags = tags;
