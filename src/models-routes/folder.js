"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.folders = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function folders(app) {
    app.post('/folders', async (request, reply) => {
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
        }
        catch (error) {
            console.error('Errore nella creazione della cartella:', error);
        }
    });
    app.get('/folders', async (request, reply) => {
        try {
            const folders = await prisma.folder.findMany();
            reply.send(folders);
        }
        catch (error) {
            console.error('Errore nel recupero delle cartelle:', error);
        }
    });
    app.get('/folders/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            const folder = await prisma.folder.findUnique({
                where: { id }
            });
            if (!folder) {
                reply.code(404).send('Folder not found');
                return;
            }
            reply.send(folder);
        }
        catch (error) {
            console.error('Errore nel recupero della cartella:', error);
        }
    });
    app.put('/folders/:id', async (request, reply) => {
        const { id } = request.params;
        const updateData = request.body;
        try {
            const folder = await prisma.folder.findUnique({
                where: { id },
            });
            if (!folder) {
                reply.code(404).send('Folder not found');
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
        }
        catch (error) {
            console.error('Errore nell\'aggiornamento della cartella:', error);
        }
    });
    app.delete('/folders/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            await prisma.folder.delete({
                where: { id },
            });
            reply.send("Nessun contenuto");
        }
        catch (error) {
            console.error('Errore nella cancellazione della cartella:', error);
        }
    });
}
exports.folders = folders;
