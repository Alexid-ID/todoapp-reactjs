import React, { createContext, useState, useEffect } from "react";
import { THEMES } from "../main/colors";


export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
	const storedThemeKey = localStorage.getItem("themeKey") || "light";
	const [themeKey, setThemeKey] = useState(storedThemeKey);
	const theme = THEMES[themeKey];

	useEffect(() => {
		localStorage.setItem("themeKey", themeKey);

		const root = document.documentElement;
		Object.keys(theme).forEach((variable) => {
			root.style.setProperty(variable, theme[variable]);
		});
	}, [theme, themeKey]);

	const handleThemeChange = (newThemeKey) => {
		setThemeKey(newThemeKey); 
	};

	return <ThemeContext.Provider value={{ themeKey, handleThemeChange }}>{children}</ThemeContext.Provider>;
};
