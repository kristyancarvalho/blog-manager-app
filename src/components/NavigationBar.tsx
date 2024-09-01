import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from "./Logo";
import { motion } from 'framer-motion';

const navigationArray = [
    { title: 'Posts', link: '/' },
    { title: 'Adicionar Post', link: '/create-post' }
];

function SidebarNavigation() {
    const { pathname } = useLocation();
    const [activeTabTop, setActiveTabTop] = useState(0);
    const [activeTabHeight, setActiveTabHeight] = useState(0);
    const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    useEffect(() => {
        const activeTab = tabRefs.current.find(
            (tab) => tab?.getAttribute('href') === pathname
        );
        if (activeTab) {
            setActiveTabTop(activeTab.offsetTop);
            setActiveTabHeight(activeTab.offsetHeight);
        }
    }, [pathname]);

    return (
        <div className="fixed top-0 left-0 bottom-0 w-1/5 h-screen z-50 py-24">
            <div className="w-full flex items-center justify-center">
                <Logo />
            </div>
            <nav className="relative mt-24 flex flex-col">
                {navigationArray.map(({ title, link }, index) => (
                    <NavLink
                        key={link}
                        to={link}
                        ref={(el) => (tabRefs.current[index] = el)}
                        className={({ isActive }) => `
                            block px-16 py-4 text-xl transition duration-300 ease-in-out rounded-r-lg
                            ${isActive 
                                ? 'text-violet-500 font-extrabold bg-violet-500/20' 
                                : 'text-gray-200/80 hover:text-white'}
                        `}
                    >
                        <code>{title}</code>
                    </NavLink>
                ))}
                <motion.div
                    className="absolute left-0 w-1 bg-violet-500 rounded-full"
                    initial={false}
                    animate={{
                        top: activeTabTop,
                        height: activeTabHeight,
                    }}
                />
            </nav>
        </div>
    );
}

export default SidebarNavigation;