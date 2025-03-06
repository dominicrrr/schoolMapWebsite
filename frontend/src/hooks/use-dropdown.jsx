// hooks/useDropdown.js
import { useState } from 'react';

export const useDropdown = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleSelect = (item) => {
    setSelectedItem(item);
    setIsHovered(false);
  };

  return {
    isHovered,
    selectedItem,
    handleMouseEnter,
    handleMouseLeave,
    handleSelect,
  };
};
