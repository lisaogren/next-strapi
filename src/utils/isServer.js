/**
 * Check if code is currently being executed on the client or server
 *
 * @export
 *
 * @returns {Boolean} `true` when on server else `false`
 */
export default function isServer () {
  return typeof window === 'undefined';
}
