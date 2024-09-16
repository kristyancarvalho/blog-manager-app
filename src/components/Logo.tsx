import { Link } from 'react-router-dom';

type AccentColor = 'blue' | 'green' | 'red';

interface LogoProps {
    accentColor: AccentColor;
}

const colorMap: Record<AccentColor, string> = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500'
};

export function Logo({ accentColor }: LogoProps) {
    return (
        <Link key="home" to="/">
            <code className="transition duration-300 text-3xl text-white">
                [kristyan<strong className={`text-bold ${colorMap[accentColor]}`}>.blog</strong>]
            </code>
        </Link>
    )
}