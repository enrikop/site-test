import React from "react";
// import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

export default function Layout({ children }) {
    

    const { pathname } = useLocation()

    return (
        <>
            {pathname !== '/' && <Header />}
        
                <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 80 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -60 }}
                            transition={{ duration: 0.6, ease: [0.33, 0.7, 0.55, 1] }}
                            // style={{ minHeight: "80vh" }} // facoltativo, regola l'altezza minima
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
        </>
    );
}