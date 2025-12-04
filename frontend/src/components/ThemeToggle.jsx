import React, { useContext } from 'react';
import { ThemeContext } from '../App';

export default function ThemeToggle() {
  const { dark, toggle } = useContext(ThemeContext);

  return (
    <div className="theme-toggle-wrapper">
      <input
        type="checkbox"
        id="theme-toggle"
        className="theme-toggle-checkbox"
        checked={dark}
        onChange={toggle}
      />
      <label htmlFor="theme-toggle" className="theme-toggle-label">
        Toggle Theme
      </label>
    </div>
  );
}
