'use client'
//import { Skeleton } from "@/components/ui/skeleton"
import ClipLoader from "react-spinners/ClipLoader";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="h-full w-full flex items-center justify-center">
            <ClipLoader color="#36d7b7" loading={true} speedMultiplier={1} size={'6em'}/>
        </div>
    )
}