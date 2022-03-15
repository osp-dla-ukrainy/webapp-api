function stringifyCallback<T extends Record<string, any>>(
  fn: ((obj: T) => any) | (new (...params: any[]) => T)
): string {
  const fnStr: string = fn.toString();

  const isArrowFunction = fnStr.includes('=>');
  const hasBrackets = /[{}]/.test(fnStr);

  if (!isArrowFunction) {
    throw new Error('Expected arrow function');
  }

  if (hasBrackets) {
    throw new Error(`Callback shouldn't have brackets`);
  }

  const cleanArrayIndexes = (stringifiedCallback: string) => stringifiedCallback.replace(/\[[0-9]+\]/g, '');

  return cleanArrayIndexes(fnStr);
}

export function nameofWithAlias<T extends Record<string, any>>(
  fn: ((obj: T) => any) | (new (...params: any[]) => T)
): string {
  const removeArrowAndBrackets = (stringifiedCallback: string) => stringifiedCallback.replace(/^(\(.*\)\s=>\s)/g, '');

  const stringifiedCallback = stringifyCallback(fn);

  return removeArrowAndBrackets(stringifiedCallback);
}

export function nameof<T extends Record<string, any>>(fn: ((obj: T) => any) | (new (...params: any[]) => T)): string {
  const removeCallbackParams = (stringifiedCallback: string) =>
    stringifiedCallback.substring(stringifiedCallback.indexOf('.') + 1);

  const stringifiedCallback = stringifyCallback(fn);

  return removeCallbackParams(stringifiedCallback);
}
