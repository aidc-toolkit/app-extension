/**
 * Nullishable type. Extends a type by allowing `null` and `undefined`. Necessary because different applications treat a
 * missing value differently.
 *
 * @template T
 * Type.
 */
export type Nullishable<T> = T | null | undefined;

/**
 * Non-nullishable type. If T is an object type, it is spread and attributes within it are made non-nullishable.
 * Equivalent to a deep `Required<T>` for an object and `NonNullable<T>` for any other type.
 *
 * @template T
 * Type.
 */
export type NonNullishable<T> = T extends object ? {
    [P in keyof T]-?: NonNullishable<T[P]>
} : NonNullable<T>;

/**
 * Determine if argument is nullish. Application extension may pass `null` or `undefined` to missing parameters.
 *
 * @param argument
 * Argument.
 *
 * @returns
 * True if argument is undefined or null.
 */
export function isNullish(argument: unknown): argument is null | undefined {
    return argument === null || argument === undefined;
}
