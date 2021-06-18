import React from "react";
import { Country } from "./Country";

export const ListOfCountries = (props) => {
  return (
    <select onChange={props.onChange}>
      {props.data.map((country) => (
        <Country slug={country.Slug} />
      ))}
    </select>
  );
};
