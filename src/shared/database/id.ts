export interface Id<TValue = string> {
  get valueOf(): TValue;
  toString(): string | number;
}

export type IdConstructorType<TValue = string> = {
  new (value: TValue): Id;
};
