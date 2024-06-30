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
    process.env.REACT_APP_API_URL + "/categories/" + currentUser.username
  );
  const resObject = await response.json();
  // console.log(resObject);
  return resObject.categories;
}

if (currentUser) {
  getCategories().then((c) => {
    // console.log(categories);
    const orderedCategories = c.sort((a, b) => a.columnIdx - b.columnIdx);
    localStorage.setItem("todo-categories", JSON.stringify(orderedCategories));

    // categories = JSON.parse(localStorage.getItem("todo-categories")).map(
    //   (category, idx) => {
    //     category.columnIdx = idx;
    //     category.items = category.subjects.map((subject) => {
    //       subject.content = subject.subjectName;
    //       // subject.id = subject._id;
    //       subject.details = subject.details.map((detail) => {
    //         detail.text = detail.description;
    //         detail.detailId = detail._id;
    //         return detail;
    //       });
    //       return subject;
    //     });
    //     return category;
    //   }
    // );
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
    // console.log(e.target.name, e.target.value);
    const newState = { ...newTask };
    newState[e.target.name] = e.target.value;
    setNewTask(newState);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!newTask.content || !newTask.category) return;

    const addedTask = new Task(newTask.content);
    console.log(addedTask);
    addItem({ ...addedTask }, newTask.category); //CHANGE CATEGORY TO COLUMNIDX

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
    localStorage.setItem("todo-categories", JSON.stringify(columns));

    const response = await fetch(
      process.env.REACT_APP_API_URL +
        "/update-category-order/" +
        currentUser.username,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categories: [columns] }),
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

  const addItem = async (subject, columnIdx) => {
    console.log("subject:", subject);

    const response = await fetch(
      process.env.REACT_APP_API_URL +
        "/new-subject/" +
        currentUser.username +
        "/" +
        columnIdx,
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
  };

  const deleteItem = async (subjectId, columnIdx) => {
    console.log(subjectId, columnIdx);

    const confirmation = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmation) return;

    const response = await fetch(
      process.env.REACT_APP_API_URL +
        "/delete-subject/" +
        currentUser.username +
        "/" +
        columnIdx,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectId: subjectId,
          description: "",
        }),
      }
    );

    console.log(response);

    const resObject = await response.json();
    console.log(resObject);
  };

  const addDetail = async (detail, selectedItem) => {
    console.log(detail, selectedItem);

    const response = await fetch(
      process.env.REACT_APP_API_URL + "/new-detail/" + currentUser.username,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: detail,
          subjectId: selectedItem._id,
        }),
      }
    );

    const resObject = await response.json();
    console.log(resObject);

    // selectedItem.details.push(new Detail(detail, resObject.detailId));

    setColumns((prev) => {
      const newColumns = prev.map((column) => {
        if (column.columnIdx === selectedItem.columnIdx) {
          column.items = column.items.map((subject) => {
            if (subject._id === selectedItem._id) {
              return resObject.subject;
            }
          });
        }
        return column;
      });
      return newColumns;
    });
  };

  const deleteDetail = async (detailId, selectedItem) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this detail?"
    );

    if (!confirmation) return;

    console.log(detailId, selectedItem);

    const response = await fetch(
      process.env.REACT_APP_API_URL + "/delete-detail/" + currentUser.username,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          detailId: detailId,
          subjectId: selectedItem._id,
        }),
      }
    );

    const resObject = await response.json();
    console.log(resObject);
  };

  const editDetail = async (detail, selectedItem) => {
    const response = await fetch(
      process.env.REACT_APP_API_URL + "/update-detail/" + currentUser.username,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          detailId: detail.detailId,
          description: detail.text,
          isChecked: detail.isChecked,
          subjectId: selectedItem._id,
        }),
      }
    );

    const resObject = await response.json();
    console.log(resObject);
  };

  const setColumnName = (name, columnIdx) => {
    const newColumns = columns.map((column, idx) => {
      if (columnIdx === idx) {
        column.name = name;
      }
      return column;
    });
    setColumns([...newColumns]);
    localStorage.setItem("todo-categories", JSON.stringify(newColumns));
  };

  const setTaskName = async (name, subjectId) => {
    const response = await fetch(
      process.env.REACT_APP_API_URL + "/update-subject/" + currentUser.username,
      // + "/" +
      // columnIdx,

      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectName: name,
          description: "",
          subjectId: subjectId,
        }),
      }
    );

    const resObject = await response.json();
    console.log(resObject);
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
                                            subjectId={subject._id}
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
