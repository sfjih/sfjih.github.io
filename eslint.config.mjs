import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"

export default defineConfig([
  ...nextVitals,
  {
    files: ["**/*.test.tsx"],
    languageOptions: {
      globals: {
        expect: "readonly",
        it: "readonly",
      },
    },
  },
  globalIgnores([".next/**", "node_modules/**", "playwright-report/**", "test-results/**"]),
])
