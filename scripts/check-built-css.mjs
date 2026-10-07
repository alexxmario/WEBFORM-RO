import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const cssDirectory = path.join(root, ".next/static/css");

try {
  const files = (await readdir(cssDirectory)).filter((file) => file.endsWith(".css"));
  if (!files.length) throw new Error("No production CSS files were generated.");

  const styles = await Promise.all(files.map((file) => readFile(path.join(cssDirectory, file), "utf8")));
  for (let index = 0; index < styles.length; index++) {
    if (/@(?:tailwind|apply)\b/.test(styles[index])) {
      throw new Error(`Unprocessed Tailwind directives in ${files[index]}. Check the PostCSS configuration.`);
    }
  }

  const globalStyles = styles.find((css) => css.includes(".site-header"));
  if (!globalStyles || !globalStyles.includes(".font-sans") || !/box-sizing\s*:\s*border-box/.test(globalStyles)) {
    throw new Error("Global CSS is missing Tailwind utilities or the base reset.");
  }
  console.log("Production CSS verified: Tailwind utilities and base styles are present.");
} catch (error) {
  console.error(`Production CSS verification failed: ${error.message}`);
  process.exitCode = 1;
}
