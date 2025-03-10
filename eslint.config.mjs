import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Add a custom config object to override rules
  {
    rules: {
      // Disable the TypeScript 'no explicit any' rule
      "@typescript-eslint/no-explicit-any": "off",
      
      // Disable the Next.js img element rule
      "@next/next/no-img-element": "off",
      
      // Optional: Disable unused vars warning if needed
      // "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      // Optional: Disable React hooks dependency warning
      // "react-hooks/exhaustive-deps": "warn" // or "off" to completely disable
    }
  }
];

export default eslintConfig;