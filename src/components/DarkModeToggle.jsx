import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import './DarkModeToggle.css';

export default function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode();

  return (
    <button className="dark-mode-toggle" onClick={toggle} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      {isDark ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
}
