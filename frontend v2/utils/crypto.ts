
// IMPORTANT: This is a mock hashing function for demonstration purposes ONLY.
// It is NOT cryptographically secure.
export const sha256 = async (str: string): Promise<string> => {
  const buffer = new TextEncoder().encode(str);
  // This part is browser-dependent, but should work in modern browsers
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};
