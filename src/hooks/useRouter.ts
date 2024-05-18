import { useState, useEffect } from "react";

export const useRouter = () => {
  const [path, setPath] = useState(window.location.pathname);
  const [query, setQuery] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    document.addEventListener("popstate", popstate);
    return () => {
      document.removeEventListener("popstate", popstate);
    };
  }, []);

  const popstate = () => {
    const query = new URLSearchParams(window.location.search);
    setPath(window.location.pathname);
    setQuery(query);
  };

  const navigate = (to: string) => {
    window.history.pushState("null", "", `/react-simple-selfie?app=${to}`);
    setPath(to);
    setQuery(new URLSearchParams(window.location.search));
  }

  return { path, query, navigate };
};
