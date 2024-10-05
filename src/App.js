import React from "react";
import { ThemeProvider } from "./theme/ThemeContext"; // Import ThemeProvider
import "./App.css"; // Import CSS để sử dụng biến màu
import Todo from "./todo/Todo"; // Import Todo component

function App() {
	return (
		<ThemeProvider>
				<Todo />
				
		</ThemeProvider>
	);
}

export default App;
