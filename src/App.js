import React, { useState } from "react";
import "./App.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Task, Detail } from "./classes";
import TaskCard from "./components/TaskCard";
import Details from "./components/Details";
import ModalInput from "./components/ModalInput";
import ServerPoker from "./components/ServerPoker";
import Login from "./components/Login";

const tasks = [
  { id: "1", content: "First task" },
  { id: "2", content: "Second task" },
  { id: "3", content: "Third task" },
  { id: "4", content: "Fourth task" },
  { id: "5", content: "Fifth task" },
];

let categories = [
  {
    name: "Clients",
    items: tasks,
  },
  {
    name: "The Journey",
    items: [],
  },
  {
    name: "The Fam",
    items: [],
  },
  {
    name: "For Me",
    items: [],
  },
];

let currentUser;

// if (localStorage.getItem("columns")) {
//   categories = JSON.parse(localStorage.getItem("columns"));
// }

if (localStorage.getItem("todo-currentUser")) {
  currentUser = JSON.parse(localStorage.getItem("todo-currentUser"));
}

if (localStorage.getItem("todo-categories")) {
  categories = JSON.parse(localStorage.getItem("todo-categories")).map(
    (category, idx) => {
      category.columnIdx = idx;
      category.items = category.subjects.map((subject) => {
        subject.content = subject.subjectName;
        // subject.id = subject._id;
        subject.details = subject.details.map((detail) => {
          detail.text = detail.description;
          detail.detailId = detail._id;
          return detail;
        });
        return subject;
      });
      return category;
    }
  );
}

// console.log("categories:", categories);

async function getCategories() {
  const response = await fetch(
    "http://localhost:3443/categories/" + currentUser.username
  );
  const resObject = await response.json();
  // console.log(resObject);
  return resObject.categories;
}

if (currentUser) {
  getCategories().then((categories) => {
    // console.log(categories);
    const orderedCategories = categories.sort(
      (a, b) => a.columnIdx - b.columnIdx
    );
    localStorage.setItem("todo-categories", JSON.stringify(orderedCategories));
  });
}

function App() {
  const [currentPage, setCurrentPage] = useState(
    currentUser ? "home" : "login"
  );
  const [columns, setColumns] = useState(categories);
  const [newTask, setNewTask] = useState({
    content: "",
    category: "",
  });
  const [detailsShown, setDetailsShown] = useState(null);

  const onChange = (e) => {
    console.log(e.target.name, e.target.value);
    const newState = { ...newTask };
    newState[e.target.name] = e.target.value;
    setNewTask(newState);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!newTask.content || !newTask.category) return;

    const addedTask = new Task(newTask.content, newTask.category);
    console.log(addedTask);
    addItem({ ...addedTask });

    setNewTask({
      content: "",
      category: "",
    });
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const [removed] = sourceColumn.items.splice(source.index, 1);

    if (source.droppableId !== destination.droppableId) {
      destColumn.items.splice(destination.index, 0, removed);
    } else {
      sourceColumn.items.splice(destination.index, 0, removed);
    }

    setColumns([...columns]);
    localStorage.setItem("columns", JSON.stringify(columns));

    const response = await fetch(
      "http://localhost:3443/update-category-order/" + currentUser.username,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categories: columns }),
      }
    );

    const resObject = await response.json();
    console.log(resObject);
  };

  const modalOn = (subject) => {
    // console.log("modalOn runs", subject);
    setDetailsShown(subject);
  };

  const modalOff = () => {
    setDetailsShown(null);
  };

  const addItem = async (subject) => {
    console.log("subject:", subject);

    const response = await fetch(
      process.env.REACT_APP_API_URL +
        "/new-subject/" +
        currentUser.username +
        "/" +
        subject.columnIdx,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectName: subject.content,
          description: "",
        }),
      }
    );

    const resObject = await response.json();
    console.log(resObject);

    // const newColumns = columns.map((column, idx) => {
    //   // eslint-disable-next-line
    //   if (idx == subject.columnIdx) {
    //     column.subjects.push(subject);
    //   }
    //   return column;
    // });

    // console.log("newColumns:", newColumns);

    // setColumns([...newColumns]);
    // localStorage.setItem("columns", JSON.stringify(newColumns));
    // localStorage.setItem("todo-categories", JSON.stringify(newColumns));
  };

  const deleteItem = (itemId, category) => {
    console.log(itemId, category);

    const confirmation = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmation) return;

    const newColumns = columns.map((column, idx) => {
      // eslint-disable-next-line
      if (idx == category) {
        column.items = column.items.filter((subject) => subject._id !== itemId);
      }
      console.log(column);
      return column;
    });
    setColumns([...newColumns]);
    localStorage.setItem("columns", JSON.stringify(newColumns));
  };

  const addDetail = (detail, selectedItem) => {
    // console.log(detail, selectedItem);
    const newColumns = columns.map((column) => {
      column.items = column.items.map((subject) => {
        if (subject._id === selectedItem._id) {
          subject.details.push(new Detail(detail));
        }
        // console.log(subject);
        return subject;
      });
      return column;
    });
    setColumns([...newColumns]);
    localStorage.setItem("columns", JSON.stringify(newColumns));
  };

  const deleteDetail = (detailId, selectedItem) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this detail?"
    );

    if (!confirmation) return;

    const newColumns = columns.map((column) => {
      column.items = column.items.map((subject) => {
        if (subject._id === selectedItem._id) {
          subject.details = subject.details.filter(
            (detail) => detail.detailId !== detailId
          );
        }
        return subject;
      });
      return column;
    });
    setColumns([...newColumns]);
    localStorage.setItem("columns", JSON.stringify(newColumns));
  };

  const editDetail = (detail, selectedItem) => {
    const newColumns = columns.map((column) => {
      column.items = column.items.map((subject) => {
        if (subject._id === selectedItem._id) {
          subject.details = subject.details.map((d) => {
            if (d.detailId === detail.detailId) {
              d.text = detail.text;
              d.isChecked = detail.isChecked;
            }
            return d;
          });
        }
        return subject;
      });
      return column;
    });
    setColumns([...newColumns]);
    localStorage.setItem("columns", JSON.stringify(newColumns));
  };

  const setColumnName = (name, columnIdx) => {
    const newColumns = columns.map((column, idx) => {
      if (columnIdx === idx) {
        column.name = name;
      }
      return column;
    });
    setColumns([...newColumns]);
    localStorage.setItem("columns", JSON.stringify(newColumns));
  };

  const setTaskName = (name, taskIdx, columnIdx) => {
    const newColumns = columns.map((column, idx) => {
      if (columnIdx === idx) {
        column.items = column.items.map((subject, idx) => {
          if (taskIdx === idx) {
            subject.content = name;
          }
          return subject;
        });
      }
      return column;
    });
    setColumns([...newColumns]);
    localStorage.setItem("columns", JSON.stringify(newColumns));
  };

  return (
    <div>
      {/* <header> */}
      {detailsShown && (
        <>
          <div className="popup-bg" name="modal-bg" onClick={modalOff} />
          <Details
            selectedItem={detailsShown}
            addDetail={addDetail}
            deleteDetail={deleteDetail}
            editDetail={editDetail}
          />
        </>
      )}
      <main>
        <ServerPoker />
        {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
        {currentPage === "home" && (
          <>
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
            {/* </header> */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                {columns.map((column, columnIdx) => {
                  const columnId = columnIdx.toString();
                  return (
                    <div
                      className="card category-card"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                      key={columnId}
                    >
                      {/* <h2>{column.name}</h2> */}
                      <h2>
                        <ModalInput
                          name="category"
                          value={column.categoryName}
                          setValue={setColumnName}
                          idx={columnIdx}
                        />
                      </h2>
                      <div>
                        <Droppable droppableId={columnId} key={columnId}>
                          {(provided, snapshot) => {
                            return (
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
                                {column.items.map((subject, taskIdx) => {
                                  return (
                                    <Draggable
                                      key={subject._id}
                                      draggableId={subject._id}
                                      index={taskIdx}
                                    >
                                      {(provided, snapshot) => {
                                        return (
                                          <TaskCard
                                            columnIdx={columnIdx}
                                            taskIdx={taskIdx}
                                            deleteItem={deleteItem}
                                            modalOn={modalOn}
                                            provided={provided}
                                            snapshot={snapshot}
                                            item={subject}
                                            category={columnId}
                                            setValue={setTaskName}
                                          />
                                        );
                                      }}
                                    </Draggable>
                                  );
                                })}
                                {provided.placeholder}
                              </div>
                            );
                          }}
                        </Droppable>
                      </div>
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
}

export default App;
