
import { Bug as BugProject, Project as PrismaProject } from "./generated/prisma"

export type Project = PrismaProject & {
    bugs: Bug[]
}
export type Bug = BugProject & {
}
