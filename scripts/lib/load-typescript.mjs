import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const modules = new Map();

// Load the same local data/resolver modules used by Next, without a second test registry.
export function loadTypeScript(filename) {
  const absolute = path.resolve(filename);
  if (modules.has(absolute)) return modules.get(absolute).exports;
  const module = { exports: {} };
  modules.set(absolute, module);
  const source = fs.readFileSync(absolute, "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  function localRequire(specifier) {
    if (!specifier.startsWith(".")) return require(specifier);
    const base = path.resolve(path.dirname(absolute), specifier);
    if (base.endsWith(".json")) return JSON.parse(fs.readFileSync(base, "utf8"));
    const target = [base, `${base}.ts`, `${base}.tsx`].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    if (!target) throw new Error(`Cannot resolve ${specifier} from ${absolute}`);
    return loadTypeScript(target);
  }
  new Function("exports", "require", "module", compiled)(module.exports, localRequire, module);
  return module.exports;
}
