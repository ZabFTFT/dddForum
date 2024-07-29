import React from "react";

const ItemList = ({ items, onItemClick }) => (
  <ul>
    {items.map((item, index) => (
      <li key={index} onClick={() => onItemClick(index)}>
        {item}
      </li>
    ))}
  </ul>
);

export default ItemList;
