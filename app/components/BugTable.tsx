import { Bug } from '@/type'
import { Check, ListFilter, Loader } from 'lucide-react'
import React, { useMemo, useState } from 'react'
interface BugTableProps {
    bugs: Bug[],
    handleStatusChange : (idGroup :string[] , newStatus : number) => void
}

const groupBugs = (bugs: Bug[]) => {
    const groups: Record<string, Bug[]> = {}
    bugs.forEach((bug) => {
        const groupKey = `${bug.title} - ${bug.description} - ${new Date(bug.createdAt).toDateString}`
        if (!groups[groupKey]) {
            groups[groupKey] = []
        }
        groups[groupKey].push(bug)
    })
    return Object.entries(groups)
}

const BugTable = ({ bugs , handleStatusChange }: BugTableProps) => {
    const [sortAsc, setSortAsc] = useState(true)
    const groupedBugs = useMemo(() => groupBugs(bugs), [bugs])
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10;
    const [editingKey, setEditingKey] = useState<string | null>(null)

    if (bugs.length === 0) {
        return <p className='text-gray-500'>0 bug trouvé.</p>
    }


    const sortedGroups = useMemo(() => {
        return groupedBugs.sort(([_, groupeA], [__, groupeB]) => {
            const dateA = new Date(groupeA[0].createdAt).getTime()
            const dateB = new Date(groupeB[0].createdAt).getTime()
            return sortAsc ? dateA - dateB : dateB - dateA
        })
    }, [groupedBugs, sortAsc])

    const totalPages = Math.ceil(sortedGroups.length / pageSize)

    const pagedGroups = sortedGroups.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )
    const bugsTotal = bugs.length
    const bugsDisplayedBefore = sortedGroups
        .slice(0, (currentPage - 1) * pageSize)
        .reduce((acc, [, group]) => acc + group.length, 0)

    const bugsDisplayedCurrent = pagedGroups.reduce(
        (acc, [, group]) => acc + group.length, 0
    )

    const bugsRemaining = bugsTotal - bugsDisplayedBefore - bugsDisplayedCurrent

    const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1))
    const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1))

    const onChangeStatus = (key : string , allIds : string [] , newStatus : number) => {
        handleStatusChange(allIds , newStatus)
        setEditingKey(null)
    }



    return (
        <>
            <div className='overflow-x-auto border border-primary/20 rounded-xl'>
                <table className='table w-full'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nombre</th>
                            <th>Description</th>
                            <th
                                className='cursor-pointer select-none flex items-center gap-2 font-bold'
                                onClick={() => setSortAsc(!sortAsc)}
                            >
                                <span>Date</span>
                                <ListFilter
                                    className={`w-4 h-4 text-primary transition-transform duration-300 ${sortAsc ? "rotate-0" : "rotate-180"}`}
                                />
                            </th>
                            <th>
                                Status du bug (Groupe)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedGroups.map(([key, group], index) => {
                            const firstBug = group[0]
                            const status = firstBug.status
                            const allIds = group.map((b) => b.id)

                            const isEditing = editingKey === key
                            return (
                                <tr key={key} className='hover: bg-base-100 transition-colors'>
                                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                    <td>
                                        <span className='badge badge-primary'>{group.length}</span>
                                    </td>
                                    <td>
                                        <div className='flex flex-col gap-1'>
                                            <h1 className='text-md font-bold'>{firstBug.title}</h1>
                                            <div>
                                                <p className='text-sm font-mono'>
                                                    {firstBug.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {new Date(firstBug.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className='w-fit'>
                                        {!isEditing ? (
                                            <span
                                                onClick={() => setEditingKey(key)}
                                                className={`badge badge-sm badge-soft ${status == 1 ? "badge-error" : "badge-success"}`}>
                                                {status == 1
                                                    ? <Loader className='w-4 h-4 animate-spin' />
                                                    : <Check className='w-4 h-4 ' />
                                                }
                                                {status == 1
                                                    ? "En Attente"
                                                    : "Corrigé"
                                                }
                                            </span>
                                        ) : (
                                            <select className='select select-xs select-bordered w-fit'
                                                value={status}
                                                onBlur={() => setEditingKey(null)}
                                                onChange={(e) =>
                                                    onChangeStatus(key, allIds, Number(e.target.value))
                                                }
                                            >
                                                <option value={1}> En Attente</option>
                                                <option value={2}>Corrigé</option>
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className='flex items-center justify-end mt-4'>
                <div className="join grid grid-cols-2">
                    <button
                        onClick={goPrev}
                        className="join-item btn btn-outline btn-sm">
                        Page précédente({bugsDisplayedBefore})
                    </button>
                    <button
                        onClick={goNext}
                        className="join-item btn btn-outline btn-sm">
                        Suivante ({bugsRemaining})
                    </button>
                </div>
            </div>

        </>
    )
}

export default BugTable
