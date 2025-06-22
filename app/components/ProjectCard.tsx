import { Project } from '@/type'
import { Check, ClockFading, Loader } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

interface ProjectCardProps {
    project: Project,
    
}

const ProjectCard = ({ project }: ProjectCardProps) => {
    const totalBugs = project.bugs.length;
    const pendingBugs = project.bugs.filter(bug => bug.status === 1).length
    const fixedBugs = project.bugs.filter(bug => bug.status === 2).length
    const pendingPercentage = totalBugs > 0 ? (pendingBugs / totalBugs) * 100 : 0
    const fixedPercentage = totalBugs > 0 ? (fixedBugs / totalBugs) * 100 : 0

    const lastBug = project.bugs.length > 0
        ? project.bugs.reduce((latest, bug) =>
            new Date(bug.createdAt) > new Date(latest.createdAt) ? bug : latest
        )
        : null

    const formatDate = (date: Date) => {
        const today = new Date();

        if (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        ) {
            return "Aujourd'hui";
        }

        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };


    return (
        <Link
            href={`/project/${project.id}`}
            className='flex  flex-col p-4 rounded-2xl border-0 bg-base-200 hover:shadow-md transition'
        >
            <div className='flex justify-between items-center'>
                <h3 className='font-bold'>{project.name}</h3>
                <span className=' flex items-baseline'>
                    <h1 className='font-semibold text-lg'>
                        {totalBugs} Bugs
                    </h1>
                    <span className='text-xs ml-2'>au total</span>
                </span>
            </div>

            <div className='flex flex-col gap-4 mt-4'>
                <div className='w-full h-4 rounded overflow-hidden bg-primary/40 flex'>
                    <div
                        style={{ width: `${pendingPercentage}%` }}
                        className='bg-primary'
                    > </div>
                    <div
                        style={{ width: `${fixedPercentage}%` }}
                    > </div>
                </div>

                <div className='flex md:justify-between flex-col md:flex-row gap-2 md:gap-0 text-xs mt-1 '>
                    <div className='btn btn-neutral btn-sm'>
                        <span className='badge badge-sm'>{pendingBugs}</span>
                        <span>En attente</span>
                        <span className='badge badge-sm font-bold'>
                            {pendingPercentage.toFixed(0)}%
                        </span>
                    </div>
                    <div className='btn btn-neutral btn-sm'>
                        <span className='badge badge-sm'>{fixedBugs}</span>
                        <span>Corrigés</span>
                        <span className='badge badge-sm font-bold'>
                            {fixedPercentage.toFixed(0)}%
                        </span>
                    </div>
                </div>

                {lastBug && (
                    <>
                        <div className='bg-primary/10 p-5 rounded-2xl'>
                            <div className='badge badge-sm badge-neutral mb-2'>
                                <ClockFading className='w-4 h-4' />
                                {formatDate(lastBug.createdAt)}
                            </div>
                            <div className='flex flex-col gap-1'>
                                <h1 className='text-md font-bold flex md:flex-row md:items-center flex-col-reverse md:gap-4 gap-2'>
                                    <span>{lastBug.title}</span>
                                    <span className={`badge badge-sm badge-soft ${lastBug.status == 1 ? "badge-error" : "badge-success"}`}>
                                        {lastBug.status == 1
                                            ? <Loader className='w-4 h-4 animate-spin' />
                                            : <Check className='w-4 h-4 ' />
                                        }
                                        {lastBug.status == 1
                                            ? "En Attente"
                                            : "Corrigé"
                                        }
                                    </span>
                                </h1>
                                <div>
                                    <p className='text-sm font-mono'>{lastBug.description}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

        </Link>
    )
}

export default ProjectCard
