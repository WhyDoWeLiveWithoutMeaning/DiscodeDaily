export async function getDailyProblem() {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api'}/code/daily-challenge`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch daily problem: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching daily problem:", error);
    throw error;
  }
}