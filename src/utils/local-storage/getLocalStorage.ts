export const getLocalStorage = (key: string) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}
