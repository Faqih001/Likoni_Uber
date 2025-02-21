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

export const useFetch = <T>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
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
