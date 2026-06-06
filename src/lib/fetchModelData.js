async function fetchModel(url) {
  try {
    const response = await fetch(`http://localhost:8080${url}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  }
  catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export default fetchModel;

export const API_BASE_URL = 'http://localhost:8080';