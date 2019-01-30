type DeepPartialUnion<T, TAlt> = (
  T | TAlt | (
    T extends object
      ? {
        readonly [P in keyof T]?: T[P] extends Array<infer U>
          ? TAlt | Array<DeepPartialUnion<U, TAlt>>
          : T[P] extends ReadonlyArray<infer U>
            ? TAlt | ReadonlyArray<DeepPartialUnion<U, TAlt>>
            : DeepPartialUnion<T[P], TAlt>
      }
      : T
  )
);

export default DeepPartialUnion;