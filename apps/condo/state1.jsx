import React, { createContext, useContext, useState } from 'react'
import { Property } from '@condo/domains/property/utils/clientSchema'

function createContextHOC (name, defaultValue = {}, useQuery) {
    const DEBUG_RERENDERS = true
    const DEBUG_RERENDERS_BY_WHY_DID_YOU_RENDER = true

    const MyContext = createContext(defaultValue)

    if (process.env.NODE_ENV !== 'production') {
        MyContext.displayName = `MyContext<${name}>`
    }

    const withMyContext = ({ ...opts } = {}) => PageComponent => {
        const WithMyContext = ({ ...pageProps }) => {
            if (DEBUG_RERENDERS) console.log(`WithMyContext<${name}>()`, pageProps)
            return (
                <MyContextProvider initialValue={defaultValue}>
                    <PageComponent {...pageProps} />
                </MyContextProvider>
            )
        }

        if (DEBUG_RERENDERS_BY_WHY_DID_YOU_RENDER) WithMyContext.whyDidYouRender = true

        // Set the correct displayName in development
        if (process.env.NODE_ENV !== 'production') {
            const displayName = PageComponent.displayName || PageComponent.name || 'Component'
            WithMyContext.displayName = `withMyContext<${name}>(${displayName})`
        }

        return WithMyContext
    }

    const MyContextProvider = ({ children, initialValue }) => {
        const [state, setState] = useState(initialValue)
        const data = useQuery()
        const value = {
            ...state,
            data,
            setState,
        }

        if (DEBUG_RERENDERS) console.log(`ContextProvider<${name}>()`, value)

        return (
            <MyContext.Provider value={value}>
                {children}
            </MyContext.Provider>
        )
    }

    if (DEBUG_RERENDERS_BY_WHY_DID_YOU_RENDER) MyContextProvider.whyDidYouRender = true

    if (process.env.NODE_ENV !== 'production') {
        MyContextProvider.displayName = `MyContextProvider<${name}>`
    }

    const useMyContext = () => useContext(MyContext)

    return {
        useMyContext,
        withMyContext,
    }
}

export const {
    useMyContext,
    withMyContext,
} = createContextHOC(
    'test1',
    { foo: 1 },
    function useQuery () {
        return Property.useObjects({})
    },
)
