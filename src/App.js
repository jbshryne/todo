import React, { useState } from "react";
import "./App.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import TaskCard from "./components/TaskCard";
import { Task, Detail } from "./classes";
import Details from "./components/Details";

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

if (localStorage.getItem("columns")) {
  categories = JSON.parse(localStorage.getItem("columns"));
}

function App() {
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
    // if (!categories.includes(newThing.category)) {
    //   console.log("new category added", newThing.category);
    //   addCategory(newThing.category);
    // }
    if (!newTask.content || !newTask.category) return;

    const addedTask = new Task(newTask.content, newTask.category);
    console.log(addedTask);
    addItem({ ...addedTask });

    setNewTask({
      content: "",
      category: "",
    });
  };

  const onDragEnd = (result) => {
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
  };

  const modalOn = (item) => {
    // console.log("modalOn runs", item);
    setDetailsShown(item);
  };

  const modalOff = () => {
    setDetailsShown(null);
  };

  const addItem = (item) => {
    console.log(item);
    const newColumns = columns.map((column, idx) => {
      // eslint-disable-next-line
      if (idx == item.columnIdx) {
        column.items.push(item);
      }
      return column;
    });
    setColumns([...newColumns]);
    localStorage.setItem("columns", JSON.stringify(newColumns));
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
        column.items = column.items.filter((item) => item.id !== itemId);
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
      column.items = column.items.map((item) => {
        if (item.id === selectedItem.id) {
          item.details.push(new Detail(detail));
        }
        // console.log(item);
        return item;
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
      column.items = column.items.map((item) => {
        if (item.id === selectedItem.id) {
          item.details = item.details.filter(
            (detail) => detail.detailId !== detailId
          );
        }
        return item;
      });
      return column;
    });
    setColumns([...newColumns]);
    localStorage.setItem("columns", JSON.stringify(newColumns));
  };

  const editDetail = (detail, selectedItem) => {
    const newColumns = columns.map((column) => {
      column.items = column.items.map((item) => {
        if (item.id === selectedItem.id) {
          item.details = item.details.map((d) => {
            if (d.detailId === detail.detailId) {
              d.text = detail.text;
              d.isChecked = detail.isChecked;
            }
            return d;
          });
        }
        return item;
      });
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
        <h1 className="App-header" style={{ textAlign: "center" }}>
          Things About Which I Should Stop Procrastinating
        </h1>
        <form onSubmit={onSubmit}>
          <input
            onChange={onChange}
            value={newTask.content}
            type="text"
            name="content"
            placeholder="New Task?"
          />
          <select onChange={onChange} name="category" value={newTask.category}>
            <option value="">Category:</option>
            {columns.map((column, idx) => (
              <option key={idx} value={idx}>
                {column.name}
              </option>
            ))}
          </select>
          <button>Add this task</button>
        </form>
        {/* </header> */}
        <div
          style={{ display: "flex", justifyContent: "center", height: "100%" }}
        >
          <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
            {columns.map((column, idx) => {
              const columnId = idx.toString();
              // console.log("columnId", columnId, "column", column);
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
                  <h2>{column.name}</h2>
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
                              padding: 4,
                              width: 272,
                              minHeight: 436,
                              borderRadius: "5px",
                            }}
                          >
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <TaskCard
                                        deleteItem={deleteItem}
                                        modalOn={modalOn}
                                        provided={provided}
                                        snapshot={snapshot}
                                        item={item}
                                        category={columnId}
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
      </main>
    </div>
  );
}

export default App;
