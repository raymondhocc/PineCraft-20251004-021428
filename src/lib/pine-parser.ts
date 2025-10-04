export type PineParameterType = 'int' | 'float' | 'bool' | 'string' | 'source';
export interface PineParameter {
  name: string;
  type: PineParameterType;
  title: string;
  defval: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  tooltip?: string;
  originalLine: string;
}
const INPUT_REGEX = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*input\.(int|float|bool|string|source)\(([^)]+)\)/;
const LEGACY_INPUT_REGEX = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*input\(([^)]+)\)/;
const parseArgs = (argsStr: string): Record<string, string> => {
  const args: Record<string, string> = {};
  // This regex handles named arguments and correctly splits by comma, ignoring commas inside strings.
  const regex = /(?:[^\s,"]|"(?:\\.|[^"])*")+/g;
  const parts = argsStr.match(regex) || [];
  if (parts.length > 0) {
    args.defval = parts[0];
  }
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.includes('=')) {
      const [key, ...valueParts] = part.split('=');
      args[key.trim()] = valueParts.join('=').trim();
    } else if (i === 1 && !args.title) { // Positional title argument
      args.title = part;
    }
  }
  return args;
};
const cleanString = (str: string): string => {
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1);
  }
  if (str.startsWith("'") && str.endsWith("'")) {
    return str.slice(1, -1);
  }
  return str;
};
export const parsePineScript = (script: string): PineParameter[] => {
  const lines = script.split('\n');
  const parameters: PineParameter[] = [];
  lines.forEach(line => {
    const match = line.match(INPUT_REGEX) || line.match(LEGACY_INPUT_REGEX);
    if (!match) return;
    const isLegacy = !match[2];
    const name = match[1];
    const typeStr = isLegacy ? 'any' : match[2];
    const argsStr = isLegacy ? match[2] : match[3];
    const args = parseArgs(argsStr);
    let type: PineParameterType = typeStr as PineParameterType;
    let defval: any = args.defval;
    if (isLegacy) {
        if (!isNaN(parseFloat(defval)) && defval.includes('.')) {
            type = 'float';
            defval = parseFloat(defval);
        } else if (!isNaN(parseInt(defval, 10))) {
            type = 'int';
            defval = parseInt(defval, 10);
        } else if (defval === 'true' || defval === 'false') {
            type = 'bool';
            defval = defval === 'true';
        } else {
            type = 'string';
            defval = cleanString(defval);
        }
    } else {
        switch (type) {
            case 'int': defval = parseInt(args.defval, 10); break;
            case 'float': defval = parseFloat(args.defval); break;
            case 'bool': defval = args.defval === 'true'; break;
            case 'string': defval = cleanString(args.defval); break;
            case 'source': defval = args.defval; break;
        }
    }
    parameters.push({
      name,
      type,
      title: cleanString(args.title || name),
      defval,
      min: args.minval ? parseFloat(args.minval) : undefined,
      max: args.maxval ? parseFloat(args.maxval) : undefined,
      step: args.step ? parseFloat(args.step) : undefined,
      tooltip: args.tooltip ? cleanString(args.tooltip) : undefined,
      originalLine: line,
    });
  });
  return parameters;
};
const escapeString = (str: string): string => {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
};
export const generateOutputScript = (
  originalScript: string,
  parameters: PineParameter[],
  values: Record<string, any>
): string => {
  let script = originalScript;
  parameters.forEach(param => {
    const value = values[param.name];
    if (value === undefined) return;
    const match = param.originalLine.match(INPUT_REGEX) || param.originalLine.match(LEGACY_INPUT_REGEX);
    if (!match) return;
    const isLegacy = !match[2];
    const argsStr = isLegacy ? match[2] : match[3];
    const parts = argsStr.match(/(?:[^\s,"]|"(?:\\.|[^"])*")+/g) || [];
    let newValueStr = value;
    if (param.type === 'string') {
        // For source type, TradingView often uses the variable name directly, not a string
        newValueStr = `"${escapeString(value)}"`;
    } else if (param.type === 'source') {
        // Check if the value is a built-in like 'close', 'open', etc. or a custom variable
        // If it's not wrapped in quotes, don't add them.
        // Source inputs are variable names and should not be quoted.
        newValueStr = value;
    }
    parts[0] = newValueStr.toString();
    const newArgsStr = parts.join(', ');
    const newLine = isLegacy
      ? `${param.name} = input(${newArgsStr})`
      : `${param.name} = input.${param.type}(${newArgsStr})`;
    // Use a regex to replace the line to handle potential indentation
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const lineRegex = new RegExp(`^\\s*${escapeRegExp(param.originalLine.trim())}\\s*$`, 'm');
    script = script.replace(lineRegex, (param.originalLine.match(/^(\s*)/)?.[1] || '') + newLine);
  });
  return script;
};