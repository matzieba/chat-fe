
declare namespace CVT {
  export type Maybe<T> = T | undefined;
  export type MaybeNull<T> = T | null;
  export type Noop = () => any;
  export type MaybeNoop<T> = T | Noop;
  export type PartialNull<T> = {
    [P in keyof T]?: T[P] | null;
  };

  type CamelToSnake<T extends string> = string extends T ? string :
    T extends `${infer C0}${infer R}` ?
      `${C0 extends Lowercase<C0> ? '' : '_'}${Lowercase<C0>}${CamelToSnake<R>}` :
      '';

  export type CamelToSnakeCase<T> = T extends readonly any[] ?
    { [K in keyof T]: CamelToSnakeCase<T[K]> } :
    T extends object ? {
      [K in keyof T as CamelToSnake<Extract<K, string>>]: CamelToSnakeCase<T[K]>
    } : T

  type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]

  export type Join<K, P> = K extends string | number ?
    P extends string | number ?
      `${K}${'' extends P ? '' : '.'}${P}`
      : never : never;

  export type Leaves<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
    { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T] : '';
}
