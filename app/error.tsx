'use client' // Error components must be Client Components
 
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // TODO: Does vercel automatically log this?
    console.error(error)
  }, [error])
  return (
    <div className='flex justify-center items-center h-screen'>
        <div className='prose pb-2'>
            <div className='flex justify-center'>
                <h1 className="mb-0">Oops!</h1>
            </div>
            <p>Sorry: The website encountered an error trying that operation! It returned this message:</p>
            <div style={{ color: '#ff0000', backgroundColor: '#f5f5f5' }} className='rounded'>{error.message}</div>
            <p>If you want that operation again, click below!</p>
            <div className='w-full flex justify-center'>
                <Button className="" onClick={() => reset()}>
                    Try again
                </Button>
            </div>
        </div>
    </div>
  )
}