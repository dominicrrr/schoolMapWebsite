import React from "react";
import "./nav-bar.css";
import HeaderButton from "../buttons/header-button/header-button";

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="padding-navbar">
                <div className="content-wrapper-nav">
                    <div className="left-content-nav">
                        <HeaderButton aTag="/" text="App"/>
                    </div>
                    <div className="right-content-nav">
                        <div className="nav-content-links">
                            <HeaderButton aTag="/about" text="About" />
                            <HeaderButton text="Settings" onClick={() => { console.log("bruh"); }} />
                            <HeaderButton aTag="https://example.com" text="Theme" target="_blank"/>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
