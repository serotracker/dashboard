import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    
    return (
        <div className="h-full flex items-center justify-center gap-x-2 border-2 py-4 px-4">
            <Skeleton className="align-middle h-full w-[15%]"/>
            <Skeleton className="align-middle h-full w-[85%]"/>
        </div>

    )
}