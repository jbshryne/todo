import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import { Thing, Detail } from "./classes";
import MyList from "./MyList";
import App from "./App";

// const categorySeed = ["Clients", "The Journey", "The Fam", "For Me"];

// const theListSeed = [
//   new Thing("Cassandra D", "Music Clients", [new Detail("Follow-up meeting")]),
//   new Thing("Moses S", "Music Clients", [new Detail("Call back")]),
//   new Thing("Paul F", "Music Clients", [
//     new Detail("Listen to reference tracks"),
//   ]),
//   new Thing("Caswell C", "Music Clients", [new Detail("Finish horn parts")]),
//   new Thing("Nightsong", "Music Clients", [
//     new Detail("Get more project files to Nate"),
//     new Detail("Make progress sheet"),
//   ]),
//   new Thing("Job Search", "The Journey", [
//     new Detail("Review '2 Hour Job Search'"),
//     new Detail("Contact Rachel aboout webpage"),
//   ]),
//   new Thing("Doordash", "The Fam", [new Detail("Schedule dash", true)]),
//   new Thing("Simon", "For Me", [new Detail("Play draft decks")]),
//   new Thing("Ostara Tree budgeting app", "The Journey", [
//     new Detail("Upload to git page"),
//   ]),
// ];

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  // <MyList theListSeed={theListSeed} categorySeed={categorySeed} />
  <App />
  // </React.StrictMode>
);
