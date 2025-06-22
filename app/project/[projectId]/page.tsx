"use client"
import BugFilter from '@/app/components/BugFilter';
import Wrapper from '@/app/components/Wrapper';
import { getProjectById } from '@/app/server';
import { Project } from '@/type';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const page = ({ params }: { params: Promise<{ projectId: string }> }) => {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async (projectId: string) => {
        try {
            setLoading(true);
            const data: Project | null = await getProjectById(projectId)
            if (!data) {
                throw new Error("Projet introuvable.");
            }
            setProject(data)
            setLoading(false);
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            const resolvedParams = await params
            fetchProjects(resolvedParams.projectId)
        }
        fetchData()
    }, [params]);

    return (
        <Wrapper>
            {loading && (
                <div className='flex justify-center'>
                    <span className="loading loading-spinner loading-xl"></span>
                </div>
            )}
            {!loading && project && (
                <div>
                    <div className="breadcrumbs text-sm">
                        <ul>
                            <li>
                                <Link href="/">Vos projets</Link>
                            </li>
                            <li className='text-primary font-bold'>{project.name}</li>
                        </ul>
                    </div>
                    <div className='flex flex-col md:flew-row'>
                        <BugFilter bugs={project.bugs} apikey={project.apiKey} projectId={project.id} projectName={project.name} fetchProject={fetchProjects} />
                    </div>
                </div>
            )}
        </Wrapper>
    )
}
export default page
