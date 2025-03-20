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
      // Disable TypeScript 'no explicit any' rule
      "@typescript-eslint/no-explicit-any": "off",

      // Disable the Next.js img element rule
      "@next/next/no-img-element": "off",

      // Disable unused vars warning if needed
      "@typescript-eslint/no-unused-vars": "off",

      // Disable the React unescaped entities rule
      "react/no-unescaped-entities": "off",

      // Optionally, disable or warn for missing dependencies in hooks:
      "react-hooks/exhaustive-deps": "off", // or "warn"
    },
  },
];

export default eslintConfig;
