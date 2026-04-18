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
