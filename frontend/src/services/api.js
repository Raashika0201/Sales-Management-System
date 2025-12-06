const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchSales = async (params = {}) => {
  try {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        acc[key] = String(value); 
      }
      return acc;
    }, {});
    
    const query = new URLSearchParams(cleanParams).toString();
    const url = query ? `${BASE_URL}?${query}` : BASE_URL;
    console.log("Fetching from:", url); 
    console.log("Params:", params); 
    console.log("Clean params:", cleanParams); 
    
    const res = await fetch(url);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("API Response data:", data); 
    return data;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
  
};
