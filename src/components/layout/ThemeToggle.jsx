import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load theme
    const saved = localStorage.getItem('vmusic-theme');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
      applyTheme(saved);
    } else {
      // System theme
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const sysTheme = systemDark ? 'dark' : 'light';
      setTheme(sysTheme);
      applyTheme(sysTheme);
    }
  }, []);

  const applyTheme = (themeToApply) => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(themeToApply);
    
    if (themeToApply === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    localStorage.setItem('vmusic-theme', themeToApply);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    console.warn('useTheme used outside ThemeProvider');
    // Fallback
    return {
      theme: 'light',
      toggleTheme: () => {
        const html = document.documentElement;
        const current = html.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = current === 'light' ? 'dark' : 'light';
        html.classList.remove('light', 'dark');
        html.classList.add(newTheme);
        localStorage.setItem('vmusic-theme', newTheme);
      }
    };
  }
  return context;
};
