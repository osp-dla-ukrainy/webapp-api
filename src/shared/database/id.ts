export interface Id<TValue = string> {
  get id(): TValue;
}

export type IdConstructorType<TValue = string> = {
  new (value: TValue): Id;
};
