import { useState } from "react";
import "./App.css";
import ListItem from "./components/ListItem";
import Details from "./components/Details";
const savedList = JSON.parse(localStorage.getItem("theList"));
const savedCategories = JSON.parse(localStorage.getItem("categories"));

function MyList({ theListSeed, categorySeed }) {
  const [theList, setTheList] = useState(savedList ? savedList : theListSeed);
  const categories = savedCategories ? savedCategories : categorySeed;
  const [detailsShown, setDetailsShown] = useState();
  const [newThing, setNewThing] = useState({
    theThing: "",
    category: "",
  });

  const handleSeed = () => {
    setTheList(theListSeed);
    localStorage.setItem("theList", JSON.stringify(theListSeed));
  };

  const addItem = (item) => {
    const newList = [...theList, item];
    setTheList(newList);
    localStorage.setItem("theList", JSON.stringify(newList));
  };

  const deleteItem = (itemId) => {
    const newList = [...theList].filter((item) => item.itemId !== itemId);
    setTheList(newList);
    localStorage.setItem("theList", JSON.stringify(newList));
  };

  const addDetail = (detail, item) => {
    const newList = [
      ...theList,
      item.details.push({
        text: detail,
        detailId: Math.random(),
        isChecked: false,
      }),
    ];
    setTheList(newList);
    localStorage.setItem("theList", JSON.stringify(newList));
  };

  const editDetail = (detail, item) => {
    const parentItem = theList.find((i) => i.itemId === item.itemId);
    const parentItemIndex = theList.findIndex((i) => i.itemId === item.itemId);
    const detailIndex = parentItem.details.findIndex(d => d.detailId === detail.detailId)

    const newList = [...theList];
    newList[parentItemIndex].details[detailIndex] = detail
    setTheList([...newList]);
    localStorage.setItem("theList", JSON.stringify(newList));
  }

  const deleteDetail = (detailId, item) => {
    const parentItem = theList.find((i) => i.itemId === item.itemId);
    const parentItemIndex = theList.findIndex((i) => i.itemId === item.itemId);
    const newDetails = parentItem.details.filter(
      (detail) => detailId !== detail.detailId
    );
    parentItem.details = newDetails;

    const newList = [...theList];
    newList[parentItemIndex] = parentItem;
    setTheList([...newList]);
    localStorage.setItem("theList", JSON.stringify(newList));
  };

  const onChange = (e) => {
    const newState = { ...newThing };
    newState[e.target.name] = e.target.value;
    setNewThing(newState);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addItem({ ...newThing });
    setNewThing({
      theThing: "",
      category: "",
    })
  };

  const modalOn = (id) => {
    const selectedItem = theList.find((item) => id === item.itemId);
    setDetailsShown(selectedItem);
  };

  const modalOff = (e) => {
    setDetailsShown(null);
  };

  const categoryList = categories.map((category, idx) => (
    <div className="card category-card" key={idx}>
      <li>
        <h2>{category}</h2>
        <ul>
          {theList
            .filter((item) => item.category === category)
            .map((item, itemIdx) => (
              <ListItem
                key={itemIdx}
                item={item}
                deleteItem={deleteItem}
                modalOn={modalOn}
              />
            ))}
        </ul>
      </li>
    </div>
  ));

  return (
    <div>
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
    </div>
  );
}

export default MyList;
