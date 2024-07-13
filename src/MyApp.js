import React, { useState, useEffect } from "react";
import "./App.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Task } from "./classes";
import TaskCard from "./components/TaskCard";
import Details from "./components/Details";
import ModalInput from "./components/ModalInput";
import ServerPoker from "./components/ServerPoker";
import Login from "./components/Login";

const initialTasks = [
  { id: "1", content: "First subject" },
  { id: "2", content: "Second subject" },
  { id: "3", content: "Third subject" },
  { id: "4", content: "Fourth subject" },
  { id: "5", content: "Fifth subject" },
];

const initialCategories = [
  {
    categoryName: "Category 1",
    subjects: initialTasks,
  },
  {
    categoryName: "Category 2",
    subjects: [],
  },
  {
    categoryName: "Category 3",
    subjects: [],
  },
  {
    categoryName: "Category 4",
    subjects: [],
  },
];

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const [columns, setColumns] = useState(initialCategories);
  const [currentUser, setCurrentUser] = useState(null);
  const [newTask, setNewTask] = useState({ content: "", category: "" });
  const [detailsShown, setDetailsShown] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("todo-currentUser");
    // const storedTasks = localStorage.getItem("todo-tasks");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      setCurrentPage("home");
    }
  }, []);

  useEffect(() => {
    const storedTasks = localStorage.getItem("todo-categories");

    if (currentUser) {
      if (storedTasks) setColumns(JSON.parse(storedTasks));
      fetchCategories();
    }
  }, [currentUser]);

  const fetchCategories = async () => {
    const response = await fetch(
      process.env.REACT_APP_API_URL + "/categories/" + currentUser.username
    );
    const resObject = await response.json();
    const categories = resObject.categories.map((category, idx) => ({
      ...category,
      columnIdx: idx,
      subjects: category.subjects.map((subject) => ({
        ...subject,
        content: subject.subjectName,
        details: subject.details.map((detail) => ({
          ...detail,
          description: detail.description,
          detailId: detail._id,
        })),
      })),
    }));
    setColumns(categories);
    localStorage.setItem("todo-categories", JSON.stringify(categories));
  };

  const onChange = (e) => {
    console.log(e.target.value);
    setNewTask((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.content || !newTask.category) return;

    const addedTask = new Task(newTask.content);
    const columnIdx = newTask.category;

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/new-subject/${currentUser.username}/${columnIdx}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectName: addedTask.content,
          description: "",
        }),
      }
    );

    const resObject = await response.json();

    setColumns((prev) =>
      prev.map((column, idx) =>
        // eslint-disable-next-line
        idx == columnIdx
          ? {
              ...column,
              subjects: [...column.subjects, resObject.subject],
            }
          : column
      )
    );

    setNewTask({ content: "", category: "" });
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const [removed] = sourceColumn.subjects.splice(source.index, 1);

    if (source.droppableId !== destination.droppableId) {
      destColumn.subjects.splice(destination.index, 0, removed);
    } else {
      sourceColumn.subjects.splice(destination.index, 0, removed);
    }

    const newColumns = [...columns];
    setColumns(newColumns);

    await fetch(
      `${process.env.REACT_APP_API_URL}/update-category-order/${currentUser.username}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: newColumns }),
      }
    );
  };

  const modalOn = (subject) => setDetailsShown(subject);

  const modalOff = () => setDetailsShown(null);

  const addItem = async (subject, columnIdx) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/new-subject/${currentUser.username}/${columnIdx}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectName: subject.content, description: "" }),
      }
    );

    const resObject = await response.json();
    setColumns((prev) =>
      prev.map((column, idx) =>
        idx === columnIdx
          ? {
              ...column,
              subjects: [...column.subjects, resObject.subject],
            }
          : column
      )
    );
  };

  const deleteItem = async (subjectId, columnIdx) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmation) return;

    await fetch(
      `${process.env.REACT_APP_API_URL}/delete-subject/${currentUser.username}/${columnIdx}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId }),
      }
    );

    setColumns((prev) =>
      prev.map((column, idx) =>
        idx === columnIdx
          ? {
              ...column,
              subjects: column.subjects.filter((s) => s._id !== subjectId),
            }
          : column
      )
    );
  };

  const addDetail = async (detail, selectedSubject) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/new-detail/${currentUser.username}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: detail,
          subjectId: selectedSubject._id,
        }),
      }
    );

    const resObject = await response.json();

    // console.log(resObject);

    setColumns((prev) =>
      prev.map((column) =>
        column.columnIdx === selectedSubject.columnIdx
          ? {
              ...column,
              subjects: column.subjects.map((subject) =>
                subject._id === selectedSubject._id
                  ? {
                      ...subject,
                      details: resObject.subject.details?.map((d) =>
                        d._id === detail._id ? detail : d
                      ),
                    }
                  : subject
              ),
            }
          : column
      )
    );

    setDetailsShown((prev) => ({
      ...prev,
      details: resObject.subject.details.map((d) =>
        d._id === detail._id ? detail : d
      ),
    }));

    localStorage.setItem(
      "todo-categories",
      JSON.stringify(
        columns.map((column) =>
          column.columnIdx === selectedSubject.columnIdx
            ? {
                ...column,
                subjects: column.subjects.map((subject) =>
                  subject._id === selectedSubject._id
                    ? {
                        ...subject,
                        details: resObject.subject.details?.map((d) =>
                          d._id === detail._id ? detail : d
                        ),
                      }
                    : subject
                ),
              }
            : column
        )
      )
    );
  };

  const deleteDetail = async (detailId, selectedSubject) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this detail?"
    );
    if (!confirmation) return;

    await fetch(
      `${process.env.REACT_APP_API_URL}/delete-detail/${currentUser.username}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ detailId, subjectId: selectedSubject._id }),
      }
    );

    setColumns((prev) =>
      prev.map((column) =>
        column.columnIdx === selectedSubject.columnIdx
          ? {
              ...column,
              subjects: column.subjects.map((subject) =>
                subject._id === selectedSubject._id
                  ? {
                      ...subject,
                      details: subject.details.filter(
                        (detail) => detail._id !== detailId
                      ),
                    }
                  : subject
              ),
            }
          : column
      )
    );

    setDetailsShown((prev) => ({
      ...prev,
      details: prev.details.filter((d) => d._id !== detailId),
    }));

    localStorage.setItem(
      "todo-categories",
      JSON.stringify(
        columns.map((column) =>
          column.columnIdx === selectedSubject.columnIdx
            ? {
                ...column,
                subjects: column.subjects.map((subject) =>
                  subject._id === selectedSubject._id
                    ? {
                        ...subject,
                        details: subject.details.filter(
                          (detail) => detail._id !== detailId
                        ),
                      }
                    : subject
                ),
              }
            : column
        )
      )
    );
  };

  const editDetail = async (detail, selectedSubject) => {
    console.log(detail, selectedSubject);

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/update-detail/${currentUser.username}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          detailId: detail.detailId,
          description: detail.description,
          isChecked: detail.isChecked,
          subjectId: selectedSubject._id,
        }),
      }
    );

    const resObject = await response.json();

    console.log(resObject);

    setColumns((prev) =>
      prev.map((column, idx) =>
        column.columnIdx === idx
          ? {
              ...column,
              subjects: column.subjects.map((subject) =>
                subject._id === selectedSubject._id
                  ? {
                      ...subject,
                      details: subject.details?.map((d) =>
                        d._id === detail._id ? detail : d
                      ),
                    }
                  : subject
              ),
            }
          : column
      )
    );

    setDetailsShown((prev) => ({
      ...prev,
      details: prev.details.map((d) => (d._id === detail._id ? detail : d)),
    }));

    localStorage.setItem(
      "todo-categories",
      JSON.stringify(
        columns.map((column, idx) =>
          column.columnIdx === idx
            ? {
                ...column,
                subjects: column.subjects.map((subject) =>
                  subject._id === selectedSubject._id
                    ? {
                        ...subject,
                        details: subject.details?.map((d) =>
                          d._id === detail._id ? detail : d
                        ),
                      }
                    : subject
                ),
              }
            : column
        )
      )
    );
  };

  const setColumnName = (name, columnIdx) => {
    console.log(name, columnIdx);
    console.log("type of columnIdx", typeof columnIdx);
    setColumns((prev) =>
      prev.map((column, idx) =>
        idx === columnIdx ? { ...column, categoryName: name } : column
      )
    );

    fetch(
      `${process.env.REACT_APP_API_URL}/update-category/${currentUser.username}/${columnIdx}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName: name }),
      }
    );

    localStorage.setItem(
      "todo-categories",
      JSON.stringify(
        columns.map((column, idx) =>
          idx === columnIdx ? { categoryName: name } : column
        )
      )
    );
  };

  const setTaskName = async (name, subjectId) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/update-subject/${currentUser.username}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectName: name, subjectId }),
      }
    );

    const resObject = await response.json();

    setColumns((prev) =>
      prev.map((column) => ({
        ...column,
        subjects: column.subjects.map((subject) =>
          subject._id === subjectId ? resObject.subject : subject
        ),
      }))
    );

    localStorage.setItem(
      "todo-categories",
      JSON.stringify(
        columns.map((column) => ({
          ...column,
          subjects: column.subjects.map((subject) =>
            subject._id === subjectId ? resObject.subject : subject
          ),
        }))
      )
    );
  };

  return (
    <div className="container">
      {detailsShown && (
        <>
          <div className="popup-bg" name="modal-bg" onClick={modalOff} />
          <Details
            selectedSubject={detailsShown}
            addDetail={addDetail}
            deleteDetail={deleteDetail}
            editDetail={editDetail}
          />
        </>
      )}
      <main>
        <ServerPoker setIsConnected={setIsConnected} />
        {currentPage === "login" && (
          <Login
            setCurrentPage={setCurrentPage}
            setCurrentUser={setCurrentUser}
          />
        )}
        {currentPage === "home" && (
          <>
            <header>
              <h1 className="App-header" style={{ textAlign: "center" }}>
                Things About Which {currentUser ? currentUser.displayName : "I"}{" "}
                Should Stop Procrastinating
              </h1>
              <div className="form-wrapper card">
                <form onSubmit={onSubmit}>
                  <input
                    className="input-form"
                    onChange={onChange}
                    value={newTask.content}
                    type="text"
                    name="content"
                    placeholder="New Task?"
                  />
                  <select
                    className="select-form"
                    onChange={onChange}
                    name="category"
                    value={newTask.category}
                  >
                    <option value="">Category:</option>
                    {columns.map((column, idx) => (
                      <option key={idx} value={idx}>
                        {column.categoryName}
                      </option>
                    ))}
                  </select>
                  <button className="submit-btn">Add this task</button>
                </form>
              </div>
            </header>
            <div
              className="category-list"
              style={{
                display: "flex",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <DragDropContext onDragEnd={onDragEnd}>
                {columns.map((column, columnIdx) => {
                  const columnId = columnIdx.toString();
                  return (
                    <div
                      key={columnId}
                      className="card category-card"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <h2>
                        <ModalInput
                          name="category"
                          value={column.categoryName}
                          setValue={setColumnName}
                          idx={columnIdx}
                        />
                      </h2>
                      <Droppable droppableId={columnId} key={columnId}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "rgb(205, 185, 144)"
                                : "rgb(225, 214, 174)",
                              width: 272,
                              minHeight: 436,
                              borderRadius: "5px",
                            }}
                          >
                            {/* removing question mark currently breaks the app */}
                            {column.subjects?.map((subject, taskIdx) => {
                              const taskId = taskIdx.toString();
                              return (
                                <Draggable
                                  key={taskId}
                                  draggableId={taskId}
                                  index={taskIdx}
                                >
                                  {(provided, snapshot) => (
                                    <TaskCard
                                      columnIdx={columnIdx}
                                      taskIdx={taskIdx}
                                      deleteItem={deleteItem}
                                      modalOn={modalOn}
                                      provided={provided}
                                      snapshot={snapshot}
                                      subject={subject}
                                      category={columnId}
                                      value={subject.subjectName}
                                      setValue={setTaskName}
                                      subjectId={subject._id}
                                    />
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </DragDropContext>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

function scan(thing, name = "thing") {
  console.log(`Scanning ${name}:`, thing);
  return thing;
}

export default App;
