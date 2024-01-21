import "./App.css";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ListItem from "./components/ListItem";
import Details from "./components/Details";
import { Thing } from "./classes";

const savedList = JSON.parse(localStorage.getItem("theList"));
const savedCategories = JSON.parse(localStorage.getItem("categories"));

function MyList({ theListSeed, categorySeed }) {
  const [theList, setTheList] = useState(savedList ? savedList : theListSeed);

  // Separate the list into a map of categories to items
  const [categoryMap, setCategoryMap] = useState(
    savedList
      ? savedList.reduce((acc, item) => {
          acc[item.category] = acc[item.category] || [];
          acc[item.category].push(item);
          return acc;
        }, {})
      : theListSeed.reduce((acc, item) => {
          acc[item.category] = acc[item.category] || [];
          acc[item.category].push(item);
          return acc;
        }, {})
  );

  // const categories = savedCategories ? savedCategories : categorySeed;
  const [categories, setCategories] = useState(
    savedCategories ? savedCategories : categorySeed
  );
  const [detailsShown, setDetailsShown] = useState();
  const [newThing, setNewThing] = useState({
    theThing: "",
    category: "",
  });

  const getFlattenedList = (categoryMap) => {
    return Object.values(categoryMap).flat();
  };

  const handleSeed = () => {
    // setTheList(theListSeed);
    setCategoryMap(
      theListSeed.reduce((acc, item) => {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
      }, {})
    );

    localStorage.setItem("theList", JSON.stringify(theListSeed));
  };

  const addCategory = (category) => {
    console.log("addCategory runs, category:", category);

    if (!category) return;
    const newCategoryMap = { ...categoryMap };
    newCategoryMap[category] = [];
    setCategoryMap(newCategoryMap);
    // localStorage.setItem(
    //   "theList",
    //   JSON.stringify(getFlattenedList(newCategoryMap))
    // );
    setCategories([...categories, category]);
    localStorage.setItem(
      "categories",
      JSON.stringify([...categories, category])
    );
  };

  const deleteCategory = (category) => {
    console.log("deleteCategory runs, category:", category);
    const newCategoryMap = { ...categoryMap };
    delete newCategoryMap[category];
    setCategoryMap(newCategoryMap);
    // localStorage.setItem(
    //   "theList",
    //   JSON.stringify(getFlattenedList(newCategoryMap))
    // );
    setCategories(categories.filter((c) => c !== category));
    localStorage.setItem(
      "categories",
      JSON.stringify(categories.filter((c) => c !== category))
    );
    //remove category from theList
    const newList = [...theList].filter((item) => item.category !== category);
    setTheList(newList);
  };

  const addItem = (item) => {
    // const newList = [...theList, item];
    // setTheList(newList);
    // localStorage.setItem("theList", JSON.stringify(newList));

    console.log("addItem runs, item:", item);

    const newCategoryMap = { ...categoryMap };
    newCategoryMap[item.category] = newCategoryMap[item.category] || [];
    newCategoryMap[item.category].push(item);
    setTheList(getFlattenedList(newCategoryMap));
    setCategoryMap(newCategoryMap);
    localStorage.setItem(
      "theList",
      JSON.stringify(getFlattenedList(newCategoryMap))
    );
  };

  const deleteItem = (itemId, category) => {
    // const newList = [...theList].filter((item) => item.itemId !== itemId);
    // setTheList(newList);
    // localStorage.setItem("theList", JSON.stringify(newList));

    const newCategoryMap = { ...categoryMap };
    console.log(itemId);
    newCategoryMap[category] = newCategoryMap[category].filter(
      (item) => item.itemId !== itemId
    );
    setCategoryMap(newCategoryMap);
    localStorage.setItem(
      "theList",
      JSON.stringify(getFlattenedList(newCategoryMap))
    );
  };

  const addDetail = (detail, item) => {
    // const newList = [
    //   ...theList,
    //   item.details.push({
    //     text: detail,
    //     detailId: Math.random(),
    //     isChecked: false,
    //   }),
    // ];
    // setTheList(newList);
    // localStorage.setItem("theList", JSON.stringify(newList));

    const newCategoryMap = { ...categoryMap };
    const updatedItem = { ...item };
    updatedItem.details.push({
      text: detail,
      detailId: Math.random(),
      isChecked: false,
    });
    newCategoryMap[item.category] = newCategoryMap[item.category].map((i) =>
      i.itemId === item.itemId ? updatedItem : i
    );
    setCategoryMap(newCategoryMap);
    localStorage.setItem(
      "theList",
      JSON.stringify(getFlattenedList(newCategoryMap))
    );
  };

  const editDetail = (detail, item) => {
    // const parentItem = theList.find((i) => i.itemId === item.itemId);
    // const parentItemIndex = theList.findIndex((i) => i.itemId === item.itemId);
    // const detailIndex = parentItem.details.findIndex(
    //   (d) => d.detailId === detail.detailId
    // );

    // const newList = [...theList];
    // newList[parentItemIndex].details[detailIndex] = detail;
    // setTheList([...newList]);
    // localStorage.setItem("theList", JSON.stringify(newList));

    const newCategoryMap = { ...categoryMap };
    const updatedItem = { ...item };
    const detailIndex = updatedItem.details.findIndex(
      (d) => d.detailId === detail.detailId
    );
    if (detailIndex !== -1) {
      updatedItem.details[detailIndex] = detail;
      newCategoryMap[item.category] = newCategoryMap[item.category].map((i) =>
        i.itemId === item.itemId ? updatedItem : i
      );
      setCategoryMap(newCategoryMap);
      localStorage.setItem(
        "theList",
        JSON.stringify(getFlattenedList(newCategoryMap))
      );
    }
  };

  const deleteDetail = (detailId, item) => {
    // const parentItem = theList.find((i) => i.itemId === item.itemId);
    // const parentItemIndex = theList.findIndex((i) => i.itemId === item.itemId);
    // const newDetails = parentItem.details.filter(
    //   (detail) => detailId !== detail.detailId
    // );
    // parentItem.details = newDetails;
    // const newList = [...theList];
    // newList[parentItemIndex] = parentItem;
    // setTheList([...newList]);
    // localStorage.setItem("theList", JSON.stringify(newList));

    const newCategoryMap = { ...categoryMap };
    const updatedItem = { ...item };
    const detailIndex = updatedItem.details.findIndex(
      (detail) => detailId === detail.detailId
    );
    if (detailIndex !== -1) {
      updatedItem.details.splice(detailIndex, 1);
      newCategoryMap[item.category] = newCategoryMap[item.category].map((i) =>
        i.itemId === item.itemId ? updatedItem : i
      );
      setCategoryMap(newCategoryMap);
      localStorage.setItem(
        "theList",
        JSON.stringify(getFlattenedList(newCategoryMap))
      );
    }
  };

  const onChange = (e) => {
    console.log(e.target.name, e.target.value);
    const newState = { ...newThing };
    newState[e.target.name] = e.target.value;
    setNewThing(newState);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!categories.includes(newThing.category)) {
      console.log("new category added", newThing.category);
      addCategory(newThing.category);
    }
    if (!newThing.theThing || !newThing.category) return;

    const addedThing = new Thing(newThing.theThing, newThing.category);
    addItem({ ...addedThing });

    setNewThing({
      theThing: "",
      category: "",
    });
  };

  const modalOn = (id) => {
    console.log(id, theList);
    const selectedItem = theList.find((item) => id === item.itemId);
    console.log(selectedItem);
    setDetailsShown(selectedItem);
  };

  const modalOff = (e) => {
    setDetailsShown(null);
  };

  const handleDragDrop = (results) => {
    const {
      destination,
      source,
      // draggableId,
      type,
    } = results;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === "group") {
      // const newList = [...theList];
      // const [removed] = newList.splice(source.index, 1);
      // newList.splice(destination.index, 0, removed);
      // setTheList(newList);
      // localStorage.setItem("theList", JSON.stringify(newList));
      // return;

      const newCategoryMap = { ...categoryMap };
      const sourceCategory = categoryMap[source.droppableId];
      const destinationCategory = categoryMap[destination.droppableId];

      const [removed] = sourceCategory.splice(source.index, 1);
      destinationCategory.splice(destination.index, 0, removed);

      newCategoryMap[source.droppableId] = sourceCategory;
      newCategoryMap[destination.droppableId] = destinationCategory;

      setCategoryMap(newCategoryMap);
      localStorage.setItem(
        "theList",
        JSON.stringify(getFlattenedList(newCategoryMap))
      );
    }
  };

  const categoryList = categories.map((category, idx) => (
    <div className="card category-card" key={idx}>
      <li>
        <h2>
          {category}{" "}
          <button
            onClick={deleteCategory.bind(null, category)}
            name="delete-btn"
            style={{
              position: "absolute",
              right: 15,
            }}
          >
            X
          </button>
        </h2>
        <Droppable droppableId={category} type="group">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {console.log(categoryMap[category], categoryMap, category)}
              {categoryMap[category] &&
                categoryMap[category].map((item, itemIdx) => (
                  <Draggable
                    key={item.itemId}
                    draggableId={item.itemId}
                    index={itemIdx}
                  >
                    {(provided) => (
                      <ListItem
                        provided={provided}
                        key={itemIdx}
                        item={item}
                        category={category}
                        deleteItem={deleteItem}
                        modalOn={modalOn}
                      />
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </li>
    </div>
  ));

  return (
    <div>
      <DragDropContext onDragEnd={handleDragDrop}>
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
          <header>
            <h1 className="App-header">
              Things I Should Stop Procrastinating About
            </h1>
            {/* input for adding new category: */}
            <form onSubmit={onSubmit}>
              <input
                onChange={onChange}
                value={newThing.category}
                type="text"
                name="category"
                placeholder="Add a new category"
              />
              <button>Add Category</button>
            </form>
            {/* input for adding new thing: */}
            <form onSubmit={onSubmit}>
              <input
                onChange={onChange}
                value={newThing.theThing}
                type="text"
                name="theThing"
                placeholder="What's the thing?"
              />
              <select
                onChange={onChange}
                name="category"
                value={newThing.category}
              >
                <option value="">Category:</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button>Add The Thing</button>
            </form>
            <button onClick={handleSeed}>Re-Seed The List</button>{" "}
          </header>
          <div className="scroll-box">
            <ul className="category-list">{categoryList}</ul>
          </div>
        </main>
      </DragDropContext>
    </div>
  );
}

export default MyList;
