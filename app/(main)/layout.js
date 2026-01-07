import React from 'react'

/**
 * MainLayout
 * Wraps the main application area (likely authenticated routes).
 * Adds container constraint and padding.
 */
const MainLayout = ({ children }) => {
    return <div className="container mx-auto p-4"> {children} </div>
}

export default MainLayout