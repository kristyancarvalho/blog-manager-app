import { useRef, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from "./Logo";
import { Home, FileText, PenTool, Menu, X, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

type AccentColor = 'blue' | 'green' | 'violet' | 'red';

interface NavItem {
    title: string;
    link: string;
    icon: React.ElementType;
    accentColor: AccentColor;
}

const navigationArray: NavItem[] = [
    { title: 'Posts', link: '/', icon: Home, accentColor: 'blue' },
    { title: 'Gerenciar Posts', link: '/manage-posts', icon: FileText, accentColor: 'green' },
    { title: 'Postar', link: '/add-posts', icon: PenTool, accentColor: 'violet' },
    { title: 'Lixeira', link: '/trash', icon: Trash2, accentColor: 'red' }
];

const colorMap: Record<AccentColor, string> = {
    blue: 'rgb(59, 130, 246)',
    green: 'rgb(34, 197, 94)',
    violet: 'rgb(139, 92, 246)',
    red: 'rgb(239, 68, 68)'
};

function SidebarNavigation() {
    const location = useLocation();
    const navRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { activeIndex, activeItem } = useMemo(() => {
        const index = navigationArray.findIndex(item => {
            if (item.link === '/') {
                return location.pathname === '/' || location.pathname.startsWith('/post/');
            }
            return item.link === location.pathname;
        });
        return { activeIndex: index, activeItem: navigationArray[index] };
    }, [location.pathname]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <button 
                onClick={toggleMenu} 
                className="lg:hidden fixed top-4 left-4 z-50 bg-violet-500 text-white p-2 rounded-full"
            >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`fixed top-0 left-0 bottom-0 w-4/5 lg:w-1/5 h-screen z-40 py-24 bg-neutral-950 transition-transform duration-300 ease-in-out transform 
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0`}>
                <div className="w-full flex items-center justify-center">
                    <Logo accentColor={activeItem?.accentColor || 'blue'} />
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
                            type: "just", 
                            stiffness: 1000, 
                            damping: 30,
                            duration: 0.2,
                        }}
                    />
                    {navigationArray.map(({ title, link, icon: Icon, accentColor }) => {
                        const isActive = link === '/' 
                            ? (location.pathname === '/' || location.pathname.startsWith('/post/'))
                            : location.pathname === link;
                        
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
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Icon className="mr-4" size={20} />
                                <code>{title}</code>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
            {isMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}
        </>
    );
}

export default SidebarNavigation;