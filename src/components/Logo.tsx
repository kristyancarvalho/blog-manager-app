import { Link } from 'react-router-dom';

export function Logo() {
    return (
        <Link key="home" to="/">
            <code className="text-3xl text-white">
                    [kristyan<strong className='text-bold text-violet-500'>.blog</strong>]
            </code>
        </Link>
    )
}