import React from 'react';

export type Theme = 'modern' | 'vintage' | 'minimal' | 'nature';

interface ThemeSelectorProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
  darkMode: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ theme, onChange, darkMode }) => {
  return (
    <select
      value={theme}
      onChange={(e) => onChange(e.target.value as Theme)}
      className={`p-2 rounded-lg ${
        darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <option value="modern">Modern Theme</option>
      <option value="vintage">Vintage Theme</option>
      <option value="minimal">Minimal Theme</option>
      <option value="nature">Nature Theme</option>
    </select>
  );
};