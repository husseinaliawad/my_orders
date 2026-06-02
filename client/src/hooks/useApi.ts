import { useEffect, useState } from "react";

export function useApi<T>(loader: () => Promise<{ data: T }>, deps: React.DependencyList = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    loader().then((res) => mounted && setData(res.data)).catch((err) => mounted && setError(err.response?.data?.message || "Something went wrong")).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, deps);
  return { data, loading, error, setData };
}
