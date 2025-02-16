import { useEffect, useState } from "react";

const useColorMode = (): [string, (mode: string) => void] => {
  const [colorMode, setColorMode] = useState<string>("light"); // Default "light"
  const [isMounted, setIsMounted] = useState(false); // Cek apakah sudah di-mount

  useEffect(() => {
    setIsMounted(true); // Komponen sudah di-mount

    const storedColor = localStorage.getItem("color-theme") ?? "light";
    setColorMode(storedColor);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Hindari error di SSR

    const className = "dark";
    const bodyClass = document.body.classList;

    if (colorMode === "dark") {
      bodyClass.add(className);
    } else {
      bodyClass.remove(className);
    }

    localStorage.setItem("color-theme", colorMode);
  }, [colorMode, isMounted]);

  return [colorMode, setColorMode];
};

export default useColorMode;
