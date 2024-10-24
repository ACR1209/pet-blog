export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidCharsRegex = /[!#$%^&*(),?":{}|<>]/;
  if (invalidCharsRegex.test(email)) {
    return false;
  }
  return emailRegex.test(email);
}
