"use server"
import prisma from "@/lib/prisma"
import { Project } from "@/type"
export async function checkAndAddUser(email: string, name: string) {
    if (!email) return
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!existingUser && name) {
            await prisma.user.create({
                data: {
                    email,
                    name
                }
            })
        }
    } catch (error) {
        console.error(error)
    }
}

export async function addProject(email: string, projectName: string) {
    if (!email && !projectName) return
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!existingUser) {
            return
        }
        await prisma.project.create({
            data: {
                name: projectName,
                userId: existingUser.id
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export async function getAllProjects(email: string): Promise<Project[]> {
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!existingUser) {
            return []
        }
        const projectsWithBugs = await prisma.project.findMany({
            where: { userId: existingUser.id },
            include: {
                bugs: true
            }
        })
        return projectsWithBugs
    } catch (error) {
        console.error(error)
        return []
    }
}

export async function getProjectById(projectId: string): Promise<Project | null> {
    if (!projectId) return null
    try {
        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
            include: {
                bugs: true
            }
        })
        if (!project) {
            return null
        }
        return project
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function changeBugStatus(bugIds: string[], newStatus: number) {
    try {
        const updated = await prisma.bug.updateMany({
            where: {
                id: { in: bugIds }
            },
            data: {
                status: newStatus
            }
        })
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function deleteProject(projectId: string) {
    if (!projectId) return null
    try {
        await prisma.project.delete({
            where: {
                id: projectId,
            }
        })
    } catch (error) {
        console.error(error)
    }
}
