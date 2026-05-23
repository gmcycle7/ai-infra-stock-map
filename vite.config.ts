import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 部署在 GitHub Pages 上，URL 會是 https://<user>.github.io/ai-infra-stock-map/
// 因此 production build 需要設定 base 子路徑；本地 dev 維持 "/" 即可。
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/ai-infra-stock-map/" : "/",
  plugins: [react()],
}));
