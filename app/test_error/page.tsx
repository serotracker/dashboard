// page.tsx
'use client';

import { useState } from 'react';

export default function RootPage(): JSX.Element {
    const [testError, setTestError] = useState(false);

    if (testError) throw new Error('test error.tsx');

    return (
        <>
            <button
                onClick={() => {
                    setTestError(true);
                }}
            >
                Error
            </button>
        </>
    );
}