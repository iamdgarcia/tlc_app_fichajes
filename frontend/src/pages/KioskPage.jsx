import React, { useContext } from 'react';
import Kiosk from '../components/Kiosk/Kiosk';
import { ThemeContext } from '../App';

export default function KioskPage() {
  const { dark } = useContext(ThemeContext);
  return <Kiosk dark={dark} />;
}
