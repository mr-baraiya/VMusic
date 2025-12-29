import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  

  console.log('ThemeToggle Component:');
  console.log('Theme from context:', theme);
  console.log('toggleTheme function:', typeof toggleTheme);
  

  if (!theme || !toggleTheme) {
    console.error('Theme context not available!');
    return (
      <button className="p-2 rounded-lg bg-red-500 text-white">
         Theme Error
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-gray-200 dark:bg-gray-700 
                 hover:bg-gray-300 dark:hover:bg-gray-600 
                 transition-all duration-300 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  );
};

export default ThemeToggle;