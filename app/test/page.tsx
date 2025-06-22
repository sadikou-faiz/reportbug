"use client";
import React from 'react';
import { reportBug } from '@/lib/reportBug';

const Page = () => {
  const handleReport = async () => {
    try {
      throw new Error("La modale ne se ferme pas après soumission.");
    } catch (error) {
      await reportBug({
        title: "Erreur d'affichage",
        description: `Erreur "${error}" dans le fichier Page.tsx à la ligne 8.`,
      });
    }
  };

  return (
    <div className='flex justify-center items-center h-screen flex-col gap-4' >
      <h1>Démo Bug Report</h1>
      <button className="btn btn-accent" onClick={handleReport}>Déclencher l'erreur</button>
    </div>
  );
};
export default Page;
