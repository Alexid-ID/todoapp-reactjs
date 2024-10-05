import React, { useContext, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { THEMES } from "../main/colors";
import "./Theme.css"; // Assuming you have styles in this file

const ThemeToggle = () => {
	const { themeKey, handleThemeChange } = useContext(ThemeContext);
	const [showThemes, setShowThemes] = useState(false); // State to toggle the theme list visibility

	return (
		<div className="theme-toggle">
			{/* Settings icon */}
			<i
				onClick={() => setShowThemes(!showThemes)}
				style={{ cursor: "pointer", fontSize: "24px" }} // Customize icon size if needed
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="currentColor"
					className="size-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
					/>
				</svg>
			</i>

			{/* Conditionally render the theme list */}
			{showThemes && (
				<ul className="theme-list">
					{Object.keys(THEMES).map((theme) => (
						<li
							key={theme}
							className={`theme-item ${themeKey === theme ? "active" : ""}`}
							onClick={() => {
								handleThemeChange(theme);
								setShowThemes(false); // Close the list after selecting a theme
							}}
						>
							{THEMES[theme].name}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default ThemeToggle;
