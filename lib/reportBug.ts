export const reportBug = async ({ title, description }: { title: string, description: string }) => {
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
        "Authorization": `Bearer ${apiKey}`,
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
};
