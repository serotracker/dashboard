'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // TODO: Replace with real logging service
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>Something went wrong in the basic handler!</h2>
      <p>The website encountered an issue. Press the button below to attempt the operation again.</p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}