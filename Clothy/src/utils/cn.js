/**
 * Utility to conditionally merge class names.
 * Filters out falsy values and joins remaining strings.
 * @param  {...(string|boolean|undefined|null)} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
