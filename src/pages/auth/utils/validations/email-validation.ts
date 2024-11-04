export function validateEmail(email: string) {
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return validEmail.test(String(email).toLowerCase())
}
