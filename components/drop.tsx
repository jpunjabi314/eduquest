/*
import { FC } from 'react'


interface Props {
  visible: boolean,
  items: {
    callback?: () => void
    label: string
  }[],
  width?: number,
  top?: number,
  setVisible?: (visible: boolean) => void
}

const Dropdown: FC<Props> = ({
  visible,
  items,
  width = 125,
  top = 40,
  setVisible
}: Props) => (
  <>
    <div className='overlay' onClick={() => setVisible && setVisible(false)} />
    <div className='dropdown'>
      <ul>
        { items.map(item => {
          return <li key={item.label} onClick={item.callback} style={{
            cursor: 'pointer'
          }}>{item.label}</li>
        })}
      </ul>
    </div>
    <style jsx>{`
      div.dropdown {
        display: ${visible ? 'flex' : 'none'};
        position: absolute;
        background: var(--color-background-alt);
        top: ${top}px;
        right: 0;
      }
      .overlay {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: -1;
        display: ${visible ? 'block' : 'none'}
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0px;
      }
      li {
        padding: 16px 4px 16px 16px;
        transition: filter .4s;
        background: var(--color-background-alt);
        width: ${width}px;
      }

      li:hover {
        filter: brightness(1.25);
      }
    `}</style>
  </>
)

export default Dropdown
*/

import React, { FC, useState } from 'react';

interface DropdownItem {
  label: string;
  value?: any;
}

interface Props {
  items: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
}

const Dropdown: FC<Props> = ({ items, onSelect }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);

  const handleToggle = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleItemClick = (item: DropdownItem) => {
    setSelectedItem(item);
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div className={`dropdown${isOpen ? ' open' : ''}`}>
      <button className="dropdown-toggle" onClick={handleToggle}>
        {selectedItem ? selectedItem.label : 'Select Points'}
      </button>
      <ul className="dropdown-menu">
        {items.map((item) => (
          <li
            key={item.label}
            className="dropdown-item"
            onClick={() => handleItemClick(item)}
          >
            {item.label}
          </li>
        ))}
      </ul>
      <style jsx>{`
        .dropdown {
          position: relative;
          display: inline-block;
        }

        .dropdown-toggle {
          padding: 6px 12px;
          background-color: #fff;
          border: 1px solid #ccc;
          cursor: pointer;
        }

        .dropdown-menu {
          display: ${isOpen ? 'block' : 'none'};
          position: absolute;
          z-index: 1;
          background-color: #fff;
          border: 1px solid #ccc;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .dropdown-item {
          padding: 6px 12px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Dropdown;
