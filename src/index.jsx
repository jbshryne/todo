import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import MyList from "./MyList";

const categorySeed = ["Music Clients", "The Journey", "The Fam", "For Me"];

const theListSeed = [
  {
    theThing: "Cassandra D",
    category: "Music Clients",
    itemId: Math.random(),
    details: [
      {
        text: "Email to schedule a zoom",
        detailId: Math.random(),
        isChecked: true,
      },
    ],
  },
  {
    theThing: "Moses S",
    category: "Music Clients",
    itemId: Math.random(),
    details: [
      {
        text: "Try calling again",
        detailId: Math.random(),
        isChecked: false,
      },
      {
        text: "Send files to Matt?",
        detailId: Math.random(),
        isChecked: false,
      },
    ],
  },
  {
    theThing: "Nightsong",
    category: "Music Clients",
    itemId: Math.random(),
    details: [
      {
        text: "Follow up w/ Nate",
        detailId: Math.random(),
        isChecked: false,
      },
      {
        text: "Make progress sheet",
        detailId: Math.random(),
        isChecked: false,
      },
    ],
  },
  {
    theThing: "MTG Conclave",
    category: "The Journey",
    itemId: Math.random(),
    details: [
      {
        text: "Rebuild using React",
        detailId: Math.random(),
        isChecked: false,
      },
    ],
  },
  {
    theThing: "Doordash",
    category: "The Fam",
    itemId: Math.random(),
    details: [
      {
        text: "Schedule dash",
        detailId: Math.random(),
        isChecked: true,
      },
    ],
  },
  {
    theThing: "Simon",
    category: "For Me",
    itemId: Math.random(),
    details: [
      {
        text: "Share SEI progress",
        detailId: Math.random(),
        isChecked: false,
      },
      {
        text: "Play draft decks",
        detailId: Math.random(),
        isChecked: false,
      },
    ],
  },
  {
    theThing: "Ostara Tree budgeting app",
    category: "The Journey",
    itemId: Math.random(),
    details: [
      {
        text: "Upload to git page",
        detailId: Math.random(),
        isChecked: false,
      },
    ],
  },
];

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MyList
      theListSeed={theListSeed}
      categorySeed={categorySeed}
      // listSeed={listSeed}
    />
  </React.StrictMode>
);
