import { NavLink } from 'react-router-dom';
import { Logo } from "./Logo";

const navigationArray = [
    { title: 'Posts', link: '/' },
    { title: 'Adicionar Post', link: '/create-post' }
];

function SidebarNavigation() {
    return (
        <div className="fixed top-0 left-0 bottom-0 w-1/5 h-screen z-50 py-24">
            <div className="w-full flex items-center justify-center">
                <Logo />
            </div>
            <nav className="relative mt-24 flex flex-col">
                {navigationArray.map(({ title, link }) => (
                    <NavLink
                        key={link}
                        to={link}
                        className={({ isActive }) => `
                            block px-16 py-4 transition duration-300 ease-in-out
                            ${isActive 
                                ? 'text-violet-500 font-extrabold border-l-4 border-violet-500 bg-violet-500/20 rounded-r-lg' 
                                : 'text-gray-200/80 hover:text-white font-medium border-l-4 border-violet-500/0'}
                        `}
                    >
                        <code>{title}</code>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}

export default SidebarNavigation;