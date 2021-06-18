import React from "react";

export const Country = (props) => {
  return <option value={props.slug}>{props.slug.toUpperCase()}</option>;
};
