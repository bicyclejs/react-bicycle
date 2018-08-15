type DeepPartial<T> = (
  T | (
    T extends object
      ? {
        readonly [P in keyof T]?: T[P] extends Array<infer U>
          ? Array<DeepPartial<U>>
          : T[P] extends ReadonlyArray<infer U>
            ? ReadonlyArray<DeepPartial<U>>
            : DeepPartial<T[P]>
      }
      : T
  )
);

export default DeepPartial;