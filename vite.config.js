import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import flowbite from "flowbite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), flowbite],
});
