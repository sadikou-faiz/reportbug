"use client"
import React from 'react'
import Wrapper from '../components/Wrapper'
import CodeBlockWithCopy from '../components/CodeBlockWithCopy';

const usageExample = `import { reportBug } from '@/lib/reportBug';
await reportBug({
  title: "Erreur d'affichage",
  description: "La modale ne se ferme pas après soumission.",
});`;

const reportBugFunction = `export const reportBug = async ({ title, description }: { title: string, description: string }) => {
  const projectId = process.env.NEXT_PUBLIC_BUG_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_BUG_API_KEY;

  if (!projectId || !apiKey) {
    throw new Error("L'ID du projet ou la clé API sont manquants.");
  }

  try {
    const response = await fetch("http://localhost:3000/api/bug", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        title,
        description,
        projectId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de l'envoi du bug.");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API :", error);
    throw error;
  }
};`;

const page = () => {
    return (
        <Wrapper>
            <h1 className='text-4xl font-bold mb-4'>3 étapes pour utiliser le bug reporter</h1>
            <ol className='list-decimal pl-5 space-y-6'>
                <li>
                    <strong className='text-primary'>Configurer l’environnement</strong> <br />
                    Ajoutez les variables suivantes dans le fichier <code className='text-primary'>.env</code>
                    <CodeBlockWithCopy
                        envVar1='NEXT_PUBLIC_BUG_PROJECT_ID=ton_project_id'
                        envVar2='NEXT_PUBLIC_BUG_API_KEY=ta_api_key'
                    />
                </li>
                <li>
                    <strong className='text-primary'>Créer la fonction de rapport</strong> <br />
                    Créez un fichier appelé <code className='text-primary'>reportBug.ts</code> ( dans lib) et placez-y le code suivant
                    <CodeBlockWithCopy
                        code={reportBugFunction}
                        language='ts'
                    />
                </li>
                <li>
                    <strong className='text-primary'>Utiliser le bug reporter</strong> <br />
                     Appelez la fonction dans une section critique de votre code (par exemple dans un <code className='text-primary'>try/catch</code> ), après avoir importé <code>reportBug</code> 
                    <CodeBlockWithCopy
                        code={usageExample}
                        language='ts'
                    />
                </li>

            </ol>

        </Wrapper>
    )
}

export default page
