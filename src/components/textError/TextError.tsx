const TextError = (error: any) => {
  return <p className='text-red-500 pl-2'>{error.error}</p>
}

export default TextError
