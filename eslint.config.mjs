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
  ...compat.config({
    rules: {
      "no-unused-vars": "warn",
      "react/react-in-jsx-scope": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": [
        "error",
        ["./pages/index.js", "./pages/about.js"],
      ],
    },
  }),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
  
];

export default eslintConfig;
