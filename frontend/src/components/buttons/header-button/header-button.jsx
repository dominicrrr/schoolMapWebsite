import React, { useState } from "react";
import "./header-button.css";

const HeaderButton = ({ 
  aTag, 
  target,
  text, 
  activeText = "Cancel", 
  onClick, 
  activatesOnClick = false 
}) => {
  const [isActive, setIsActive] = useState(false);

  const activateButton = (e) => {
    // Prevent default if the button toggles state
    if (activatesOnClick) {
      e.preventDefault();
      setIsActive((prevState) => !prevState); // Toggle active state
    }

    if (onClick) {
      onClick(); // Call any custom onClick function
    }
  };

  return (
    <a
      className={`header-button ${activatesOnClick && isActive ? "active" : ""}`}
      {...(target ? {target: target} : {})}
      {...(aTag ? { href: aTag } : {})} // Conditionally render href
      onClick={activateButton}
      role={!aTag ? "button" : undefined} // Accessibility improvement if no href
      aria-pressed={activatesOnClick && isActive} // Accessibility for buttons
    >
      <div>{isActive ? activeText : text}</div>
    </a>
  );
};

export default React.memo(HeaderButton);
