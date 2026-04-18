/**
 * Duplicates an array to create a seamless infinite-scroll dataset.
 *
 * Use this to feed a CSS-animated carousel that translates from 0 → -50%,
 * giving the illusion of continuous looping content.
 */
export function createInfiniteScrollData<T>(items: T[]): T[] {
  return [...items, ...items];
}
