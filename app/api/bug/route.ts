import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const apiKey = request.headers.get("Authorization")?.split(" ")[1];
        if (!apiKey) {
            return NextResponse.json({ error: "Clé API requise." }, { status: 401 });
        }
        const { title, description, projectId } = await request.json()

        if (!title || !description || !projectId) {
            return NextResponse.json({ error: "Titre, description et ID du projet sont requis." }, { status: 400 });
        }
        const project = await prisma.project.findUnique({
            where: { id: projectId }
        })

        if (!project) {
            return NextResponse.json({ error: "Projet non trouvé." }, { status: 404 });
        }
        await prisma.bug.create({
            data : {
                title ,
                description,
                projectId
            }
        }) 
         return NextResponse.json({ error: "Bug enregistré." }, { status: 201 });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
}

