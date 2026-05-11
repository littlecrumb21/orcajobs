import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-2": "var(--bg-2)",
        "bg-soft": "var(--bg-soft)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        muted: "var(--muted)",
        card: "var(--card)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        good: "var(--good)",
        warn: "var(--warn)",
        bad: "var(--bad)",
        chip: "var(--chip)",
      },
      fontFamily: {
        display: ["Newsreader", "Georgia", "serif"],
        body: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        s: "6px",
        DEFAULT: "10px",
        l: "18px",
      },
      boxShadow: {
        s: "0 1px 0 rgba(15,29,44,.04)",
        DEFAULT: "0 4px 18px -8px rgba(15,29,44,.18), 0 1px 0 rgba(15,29,44,.04)",
        l: "0 22px 60px -28px rgba(15,29,44,.32), 0 2px 0 rgba(15,29,44,.05)",
      },
    },
  },
  plugins: [],
} satisfies Config;
