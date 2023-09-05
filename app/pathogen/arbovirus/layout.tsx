'use client'

import React, {useReducer} from 'react'
import {ArboContext, initialState, reducer} from "@/app/pathogen/arbovirus/context";


export default function ArboLayout ({
                                           children,
                                       }: {
    children: React.ReactNode
}) {

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <ArboContext.Provider value={{state: state, dispatch: dispatch}}>
            {children}
        </ArboContext.Provider>
    )
}