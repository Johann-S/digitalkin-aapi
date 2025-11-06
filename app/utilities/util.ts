export const asyncWrap = async <T, Y = Error>(
  promise: Promise<T>
): Promise<{ result: T | null; error: Y | null }> => {
  try {
    const result = await promise

    return { error: null, result }
  } catch (error) {
    return { error, result: null }
  }
}
