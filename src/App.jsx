import React, { useState, useEffect } from "react";
import "./App.css";

// OUR FETCH FUNCTIONS --------------(Should be in api.js, inside api folder and imported into the file [folders are made but not imported to show how it wold look])------------------------------------------------------------------------------
// built in "fetch" function thats available in javascript to request data from websites
// these are just used in our react app/website, they don't require React (you could put these functions directly into your connect 4 for example)

const fetchCountryInfo = async () => {
  const list = await fetch("https://api.covid19api.com/countries"); // <--- give me this data at this url - store it in list
  return (await list.json()).sort((a, b) => (a.Country > b.Country ? 1 : -1)); // <--- this is just an extra step I added that just sorts my list after converting to json ".json()" (not required)
  // return list.json() <----- we could just do that instead
};

const fetchCountryCases = async (slug) => {
  // slug example "united-kingdom"
  const slugData = await fetch(
    `https://api.covid19api.com/total/country/${slug}/status/confirmed`
  ); // <--- same again, we're saying give me this data
  return slugData.json(); // <-------------------------------------------- return it in json format
};
//END OF FETCH---------------------------------------------------------------------------------------------------------------------------------------------

// OUR REACT COMPONENTS ------------------------------(Should be in each component file, inside components folder and imported into the file [folders are made but not imported to show how it wold look])-------------------------------------------------------------
// (basically functions we write but react gives us extra built in functionality to use if needed i.e. passing props, or using states)
// we use them to build and return a new element/div/input/form/p/ ... basically any html element or element wrapped inside each other
// we them call/run them like on [line 105-106] with any prop we want to send to the function (component)
const Country = (props) => {
  // <---- simple component that needs to be sent some props and it will return an <option> element to whatever called this "function" [line 46]
  return <option value={props.slug}>{props.slug.toUpperCase()}</option>;
};
// as you see the component/function uses "props.slug" 2 times (adds a value to the HTML option parameters) and then adds it as text (and upper cases it) inside the <option> element (so the text shows in the drop down on our page)

const ConfirmedCases = (props) => {
  // <----------- similar here, component that gets passed a "numOfCases" prop and returns a simple <p> html element to whoever called the component
  return <p className="result">CONFIRMED: {props.numOfCases}</p>;
};

const ListOfCountries = (props) => {
  // <-------- props passed again to this component (this time quite a few props including a function [onChange] which a <select> element will run when someone selects a thing from a drop down
  // on [line 43-47] we are populating the inside of the <select> HTML element with an array of <options> we now create by using [props.data].map on the large data we fetched when we loaded the page [line 75 that runs line 8 fetch funct]
  // this .map on the data array takes each object(country) in the data and picks out the "object.slug" and passes it to our component "<Country />" <--- this then returns an <option> HTML element for each country above.
  return (
    <select onChange={props.onChange}>
      {props.data.map((country) => (
        <Country slug={country.Slug} />
      ))}
    </select>
  );
}; // TLDR: this builds a <select> element with an "onChange" function attached. and inside that "<select> HERE </select> " we have a an <option> CountryName </option> for each country that makes up our drop down lists up.

// END OF COMPONENTS -----------------------------------------------------------------------------------------------------------------------------------

const App = () => {
  // create a state and setState function for the main list of data from the first API
  const [countryData, setCountryInfo] = useState([]); // <--- pass a default value that get s stored as the starting value of "countryData" <- react now watches for "setCountryInfo" to be called and updates the value passed into "countryData"
  // useState(startState) { <----- example of what useState and what its kinda doing when called
  //   // do wizardry
  //   return [ startState, theFunctionThatUpdatesStartState] // <-- i look for function then i update the "startState" variable
  // }
  // create a state and setState function for the currently selected item on our page
  const [selectedCountry, setSelectedCountry] = useState("");
  // create a state and setState function for the data of how many cases there are
  const [cases, setCases] = useState(0);

  // here we are defining a "useEffect" function inside the scope of "App" - "useEffect" is a built in react thing that runs when an < App /> is called [in the index.js file, inside the ReactDOM.Render method, line7]
  // Because we pass the "[]" as a second argument to this "useEffect" on []: it will only ever run once (when our APP is rendered - [As the previously, in the index.js file, inside the ReactDOM.Render method, line7])
  // this second argument to the "useEffect" function basically tells useEffect to run only when that second argument updates
  // (as this second argument is just a empty array that we don't have any data reference in it, it wont ever be run again after the first initial time)
  useEffect(() => {
    // line below runs a function that fetches data and returns it for us as an array of objects
    // We use one of the setState function we defined on [line 55] to edit that state variable "countryData" to our big array of data
    // this now never gets run again (unless we refresh to page and force < App /> gets re-rendered)
    fetchCountryInfo().then((data) => {
      setCountryInfo(data);
    });
  }, []);
  // {{TLDR: this function runs once when the main page is first loaded at it grabs a big load of data and stores it in our "countryData" state [line 55]}}

  // here we are defining another "UseEffect" function (it will run when something changes the passed variable on [line 105]. the "selectedCountry" state)
  useEffect(() => {
    // similar to the previous one, the code line below runs a function that fetches data and returns it for us (this time its a different source/url of data is all)
    // this function takes the name of the country we want the number of cases of (here we pass the state "selectedCountry" from [line 64])
    // this returns us a massive array of objects with a log of time and how many cases total cases there were at that time etc. we only need the last 1
    // here I assign the number of cases = to basically [the last object in the array.Cases] by using the length of the array
    // Now I use the setState function I made on [line 63] to update the "cases" state to the number we have just calculated
    // passing this below means this "useEffect" function runs when something changes the variable "selectedCountry" - i.e. the function on [line 99-101] changes it
    // in react we need a check to make sure the data exists for us to map it later in [line 106]
    fetchCountryCases(selectedCountry).then((data) => {
      if (data.cases) {
        const numOfCases = data[data.length - 1].Cases;
        setCases(numOfCases);
      }
    });
  }, [selectedCountry]);
  // {{TLDR: this function runs every time the "selectedCountry" [line 64] state is updated bu something i.e. [line 88]}}

  // this is a function we create - we can do things like pass this function into our React components as a "prop" when we call them [line 44]
  const onChange = (event) => {
    // this function gets attached to our selection box HTML item. as we pass it down as a prop [see line 105, which links to line 38]
    setSelectedCountry(event.target.value);
  };
  return (
    <div className="app">
      <h1>Covid-19</h1>
      <ListOfCountries data={countryData} onChange={onChange} />
      <ConfirmedCases numOfCases={cases} />
    </div>
  );
};

export default App;
