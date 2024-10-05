import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ThemeToggle from "../theme/ThemeToggle";
import "./Todo.css";
import "./Checkbox.css";

function App() {
	const [doingTodos, setDoingTodos] = useState(() => {
		const savedTodos = localStorage.getItem("doingTodos");
		return savedTodos ? JSON.parse(savedTodos) : [];
	});

	const [completedTodos, setCompletedTodos] = useState(() => {
		const savedTodos = localStorage.getItem("completedTodos");
		return savedTodos ? JSON.parse(savedTodos) : [];
	});

	const [todoInput, setTodoInput] = useState("");
	const [isEdit, setIsEdit] = useState(null);
	const [editInput, setEditInput] = useState("");
	const [showCompleted, setShowCompleted] = useState(true); // State to manage visibility of completed list

	useEffect(() => {
		localStorage.setItem("doingTodos", JSON.stringify(doingTodos));
		localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
	}, [doingTodos, completedTodos]);

	// handle drag and drop
	const handleOnDragEnd = (result, listType) => {
		if (!result.destination) return;

		let items;
		if (listType === "doing") {
			items = Array.from(doingTodos);
		} else {
			items = Array.from(completedTodos);
		}
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		if (listType === "doing") {
			setDoingTodos(items);
		} else {
			setCompletedTodos(items);
		}
	};

	// handle add todo
	const handleAdd = () => {
		if (todoInput.trim()) {
			setDoingTodos([...doingTodos, todoInput]);
			setTodoInput("");
		}
	};

	// handle set completed
	const handleToggleStatus = (index, listType) => {
		if (listType === "doing") {
			const movedTodo = doingTodos[index];
			setDoingTodos(doingTodos.filter((_, i) => i !== index));
			setCompletedTodos([...completedTodos, movedTodo]);
		} else {
			const movedTodo = completedTodos[index];
			setCompletedTodos(completedTodos.filter((_, i) => i !== index));
			setDoingTodos([...doingTodos, movedTodo]);
		}
	};

	// handle save todo after editing
	const handleSave = (index) => {
		if (editInput.trim()) {
			const updatedTodos = [...doingTodos];
			updatedTodos[index] = editInput;
			setDoingTodos(updatedTodos);
			setIsEdit(null); // Exit edit mode
			setEditInput("");
		}
	};

	// handle cancel edit (reverts back to original todo item)
	const handleCancel = () => {
		setIsEdit(null); // Exit edit mode
		setEditInput("");
	};

	// handle edit todo
	const handleEdit = (index) => {
		setIsEdit(index); // Enter edit mode
		setEditInput(doingTodos[index]); // Set the current todo in input for editing
	};

	// handle delete todo
	const handleDelete = (index, listType) => {
		if (listType === "doing") {
			const updatedTodos = doingTodos.filter((_, i) => i !== index);
			setDoingTodos(updatedTodos);
		} else {
			const updatedTodos = completedTodos.filter((_, i) => i !== index);
			setCompletedTodos(updatedTodos);
		}
	};

	// toggle completed list visibility
	const handleToggleCompletedList = () => {
		setShowCompleted((prev) => !prev);
	};

	return (
		<div className="todo">
			<div className="todo-header">
				<h1>My Todo</h1>
				<ThemeToggle />
			</div>

			<div className="todo-body">
				{/* todo input */}
				<div className="todo-input">
					<input
						type="text"
						placeholder="Enter your task"
						value={todoInput}
						onChange={(e) => setTodoInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleAdd();
							}
						}}
					/>
					<button onClick={handleAdd}>
						<span className="icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								className="size-6"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
						</span>
						Add todo
					</button>
				</div>

				{/* Doing list */}
				<div className="todo-doing todo-list">
					<h2>
						Todo list (<span className="doing-count">{doingTodos.length}</span>)
					</h2>
					<DragDropContext onDragEnd={(result) => handleOnDragEnd(result, "doing")}>
						<Droppable droppableId="doingTodos">
							{(provided, snapshot) => (
								<ul
									{...provided.droppableProps}
									ref={provided.innerRef}
									className={`todo-list-content ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
								>
									{doingTodos.map((todo, index) => (
										<Draggable key={index} draggableId={`doing-${index}`} index={index}>
											{(provided) => (
												<li
													className="todo-item"
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
												>
													<input
														type="checkbox"
														className="ui-checkbox"
														checked={false}
														onChange={() => handleToggleStatus(index, "doing")}
													/>

													{/* Edit mode */}
													{isEdit === index ? (
														<span className="edit-group">
															<input
																type="text"
																value={editInput}
																onChange={(e) => setEditInput(e.target.value)}
																autoFocus
																style={{
																	height: "24px",
																}}
															/>
															{/* Save & Cancel buttons */}
															<span className="button-group">
																<button onClick={() => handleSave(index)}>Save</button>
																<button onClick={handleCancel}>Cancel</button>
															</span>
														</span>
													) : (
														<span className="item-content">{todo}</span>
													)}

													{/* Edit button (hidden when editing) */}
													{isEdit !== index && (
														<button className="edit-btn" onClick={() => handleEdit(index)}>
															<i>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke-width="1.5"
																	stroke="currentColor"
																	class="size-5"
																>
																	<path
																		stroke-linecap="round"
																		stroke-linejoin="round"
																		d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
																	/>
																</svg>
															</i>
														</button>
													)}

													{/* Delete button */}
													<button
														className="delete-btn"
														onClick={() => handleDelete(index, "doing")}
													>
														<i>
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
																	d="M6 18 18 6M6 6l12 12"
																/>
															</svg>
														</i>
													</button>
												</li>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</ul>
							)}
						</Droppable>
					</DragDropContext>
				</div>

				{/* Completed list toggle */}
				<div className="todo-completed todo-list">
					<button onClick={handleToggleCompletedList} className="toggle-completed-btn">
						<h2 style={{ display: "flex", alignItems: "center" }}>
							{showCompleted ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m19.5 8.25-7.5 7.5-7.5-7.5"
									/>
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m8.25 4.5 7.5 7.5-7.5 7.5"
									/>
								</svg>
							)}
							Completed (<span className="completed-count">{completedTodos.length}</span>)
						</h2>
					</button>

					{/* Completed list */}
					{showCompleted && (
						<DragDropContext onDragEnd={(result) => handleOnDragEnd(result, "completed")}>
							<Droppable droppableId="completedTodos">
								{(provided, snapshot) => (
									<ul
										{...provided.droppableProps}
										ref={provided.innerRef}
										className={`todo-list-content ${
											snapshot.isDraggingOver ? "dragging-over" : ""
										}`}
									>
										{completedTodos.map((todo, index) => (
											<Draggable key={index} draggableId={`completed-${index}`} index={index}>
												{(provided) => (
													<li
														className="todo-item"
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													>
														<input
															type="checkbox"
															className="ui-checkbox"
															checked={true}
															onChange={() => handleToggleStatus(index, "completed")}
														/>
														<span className="item-content">{todo}</span>

														{/* Delete button */}
														<button
															className="delete-btn"
															onClick={() => handleDelete(index, "completed")}
														>
															<i>
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
																		d="M6 18 18 6M6 6l12 12"
																	/>
																</svg>
															</i>
														</button>
													</li>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</ul>
								)}
							</Droppable>
						</DragDropContext>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
