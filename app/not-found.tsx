'use client';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';

// TODO: Style this
const NotFoundUI: React.FC = () => {
    const router = useRouter();
    const currentPage = usePathname();
    return (
    <div>
        <h2>404: Page Not Found</h2>
        <p>Sorry, the page {process.env.NEXT_PUBLIC_API_GRAPHQL_URL}{currentPage} could not be found.</p>
        <Button className="w-full" onClick={() => {router.push("/")}}>
            Click here to go back to home!
        </Button>
    </div>
    )
};

export default NotFoundUI