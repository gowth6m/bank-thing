export function paramCase(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function snakeCase(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

export function removeSnakeCase(str: string) {
  return str.replace(/_/g, ' ');
}

export function removeParamCase(str: string) {
  return str.replace(/-/g, ' ');
}
