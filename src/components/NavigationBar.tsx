import { useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from "./Logo";
import { Home, FileText, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';

type AccentColor = 'blue' | 'green' | 'red';

interface NavItem {
    title: string;
    link: string;
    icon: React.ElementType;
    accentColor: AccentColor;
}

const navigationArray: NavItem[] = [
    { title: 'Posts', link: '/', icon: Home, accentColor: 'blue' },
    { title: 'Gerenciar Posts', link: '/manage-posts', icon: FileText, accentColor: 'green' },
    { title: 'Postar', link: '/add-posts', icon: PenTool, accentColor: 'red' }
];

const colorMap: Record<AccentColor, string> = {
    blue: 'rgb(59, 130, 246)',
    green: 'rgb(34, 197, 94)',
    red: 'rgb(239, 68, 68)'
};

function SidebarNavigation() {
    const location = useLocation();
    const navRef = useRef<HTMLDivElement>(null);

    const activeIndex = navigationArray.findIndex(item => item.link === location.pathname);
    const activeItem = navigationArray[activeIndex];

    return (
        <div className="fixed top-0 left-0 bottom-0 w-1/5 h-screen z-50 py-24">
            <div className="w-full flex items-center justify-center">
                <Logo />
            </div>
            <nav className="relative mt-24 mx-8 flex flex-col" ref={navRef}>
                <motion.div
                    layoutId="active-background"
                    className="absolute left-0 right-0 h-14 rounded-lg"
                    style={{ 
                        opacity: 0.2,
                        backgroundColor: colorMap[activeItem?.accentColor || 'blue'],
                        top: `${activeIndex * 56}px`
                    }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 500, 
                        damping: 30,
                    }}
                />
                {navigationArray.map(({ title, link, icon: Icon, accentColor }) => {
                    const isActive = location.pathname === link;
                    return (
                        <NavLink
                            key={link}
                            to={link}
                            className={`
                                relative z-10 flex items-center px-16 py-4 transition duration-300 ease-in-out
                                ${isActive 
                                    ? `text-${accentColor}-500 font-extrabold` 
                                    : 'text-gray-200/80 hover:text-white font-medium'}
                            `}
                        >
                            <Icon className="mr-4" size={20} />
                            <code>{title}</code>
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
}

export default SidebarNavigation;