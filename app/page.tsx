"use client"
import { Plus } from "lucide-react";
import Wrapper from "./components/Wrapper";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { addProject, getAllProjects } from "./server";
import { Project } from "@/type";
import ProjectCard from "./components/ProjectCard";

export default function Home() {
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress as string
  const [projectName, setProjectName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      alert("Veuillez donner un nom à votre projet.")
      return
    }
    setIsSubmitting(true)
    try {
      await addProject(email, projectName)
      fetchProjects()
      const modal = document.getElementById('new_project') as HTMLDialogElement
      modal?.close()
      
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchProjects = async () => {
    if (email) {
      const fetchedProjects = await getAllProjects(email)
      setProjects(fetchedProjects)
    }
  }
  useEffect(() => {
    fetchProjects();
  }, [email]);

  return (
    <Wrapper>
      <button
        onClick={() => (document.getElementById('new_project') as HTMLDialogElement).showModal()}
        className="btn btn-sm btn-primary mb-4" >
        <Plus className="w-4 h-4" />
        Nouveau projet
      </button>

      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project}/>
        ))}
      </div>

      <dialog id="new_project" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-2">Commencez par créer un projet</h3>
          <p className="text-sm text-gray-600 mb-4">
            Vous devez créer un projet pour commencer à collecter les bugs.
          </p>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nom du projet (ex : MonSite.com)"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="input input-sm input-bordered w-full"
            />
            <button
              onClick={handleCreateProject}
              className=" btn btn-sm btn-primary w-full mt-2"
            >
              {isSubmitting ? "Création en cours..." : "Créer le projet"}
            </button>
          </div>
        </div>
      </dialog>

    </Wrapper>
  );
}
