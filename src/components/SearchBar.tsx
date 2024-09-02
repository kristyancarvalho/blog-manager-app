import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, placeholder = "Pesquisar..." }) => {
  return (
    <div className="mb-6 flex">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow p-4 rounded-l bg-neutral-900 text-white"
      />
      <button 
        className="bg-violet-500 text-white px-6 rounded-r hover:bg-violet-600 transition duration-300"
      >
        <Search size={20} />
      </button>
    </div>
  );
};

export default SearchBar;