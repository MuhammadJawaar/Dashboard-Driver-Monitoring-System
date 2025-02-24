"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast, Slide, Id } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/css/toastify.css"; // Custom CSS Toastify


export default function ToastThemeProvider() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeToasts, setActiveToasts] = useState<Id[]>([]); // 🔥 Ubah ke `Id[]`

  useEffect(() => {
    const savedTheme = localStorage.getItem("color-theme") as "light" | "dark";
    setTheme(savedTheme || "light");

    const observer = new MutationObserver(() => {
      const newTheme = document.body.classList.contains("dark") ? "dark" : "light";
      setTheme(newTheme);

      activeToasts.forEach((id) => {
        toast.update(id, { theme: newTheme });
      });
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, [activeToasts]);

  useEffect(() => {
    // 🔥 Pantau perubahan toast aktif
    const unsubscribe = toast.onChange((payload) => {
      if (payload.status === "added") {
        setActiveToasts((prev) => [...prev, payload.id]); // ✅ Sekarang `payload.id` sesuai tipe
      } else if (payload.status === "removed") {
        setActiveToasts((prev) => prev.filter((id) => id !== payload.id));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      theme={theme}
      transition={Slide}
    />
  );
}
