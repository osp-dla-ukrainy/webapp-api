export function nameof<T extends object>(fn: ((obj: T) => any) | (new (...params: any[]) => T)): string {
  const fnStr: string = fn.toString();

  // It supports only arrow functions, i.e.:
  // 'x => x.prop'
  if (!fnStr.includes('=>')) {
    throw new Error('nameof: Invalid function.');
  }

  return fnStr
    .substring(fnStr.indexOf('.') + 1) // Parse name
    .replace(/[?!]/g, '') // Clean assertion operators
    .replace(/\[[0-9]+\]/g, ''); // Clean arrays
}
