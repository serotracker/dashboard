'use client';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';

const NotFoundUI: React.FC = () => {
    const router = useRouter();
    const currentPage = usePathname();
    return (
    <div className='flex justify-center items-center h-screen'>
        <div className='prose pb-2'>
            <div className='flex justify-center'>
                <h1 className="mb-0">404: Page Not Found</h1>
            </div>
            <p>Sorry, but the route <span className='p-1' style={{ color: '#ff0000', backgroundColor: '#f5f5f5' }}>{currentPage}</span> could not be found. Click the button below to navigate back home.</p>
            <div className='w-full flex justify-center'>
                <Button className="bg-background" onClick={() => {router.push("/")}}>
                    Back to home
                </Button>
            </div>
        </div>
    </div>
    )
};

export default NotFoundUI