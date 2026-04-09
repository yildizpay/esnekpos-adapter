/**
 * Raw FORM POST payload received at the merchant's `backUrl` after payment.
 *
 * EsnekPos posts this as `application/x-www-form-urlencoded`. All values are strings.
 * Pass `req.body` (Express) or the equivalent from your framework directly to
 * `client.callback.parse()`.
 *
 * @example
 * ```typescript
 * // Express
 * app.post('/payment/callback', express.urlencoded({ extended: false }), (req, res) => {
 *   const isValid = client.callback.verify(req.body, req.body.HASH);
 *   const result = client.callback.parse(req.body);
 * });
 * ```
 */
export type CallbackPayload = Record<string, string>;
