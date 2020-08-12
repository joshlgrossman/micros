export function serializeError(
  err: any
): { message: string | undefined; name: string | undefined } {
  return {
    message: err?.message,
    name: err?.name,
  };
}
