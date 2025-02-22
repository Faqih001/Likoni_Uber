import { useState, useEffect, useCallback } from "react";

// Fetch API with error handling and loading state management
export const fetchAPI = async (url: string, options?: RequestInit) => {
  // This function is used to fetch data from an API
  try {
    // Fetch data from the API
    const response = await fetch(url, options);

    if (!response.ok) {
      new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response and return it
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Custom hook to fetch data from an API with loading and error handling
export const useFetch = <T>(url: string, options?: RequestInit) => {
  // This hook is used to fetch data from an API and manage loading and error states
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API and update the state
  const fetchData = useCallback(async () => {
    // This function is used to fetch data from the API
    setLoading(true);
    setError(null);

    // Try to fetch data from the API and update the state
    try {
      // Fetch data from the API and update the state
      const result = await fetchAPI(url, options);
      setData(result.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
