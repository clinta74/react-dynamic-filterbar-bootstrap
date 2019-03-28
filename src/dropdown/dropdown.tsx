import React from 'react';
import classNames from 'classnames';
import { Icon } from 'react-svg-icon-host';
import { FilterBar } from '../filter-bar';
import { FilterBarIcons } from '../filter-bar-icons';

export type DropDownItem<T> = {
  value: T,
  option: JSX.Element | string,
}

export type OnChangeDropdownHandler<T> = (value: T) => void;

type DropdownProps<T> = {
  label: JSX.Element | string,
  labelClassName?: string,
  buttonClassName?: string,
  items: DropDownItem<T>[],
  onChange?: OnChangeDropdownHandler<T>,
};

type DropdownState = {
  isActive: boolean,
}

export class Dropdown<T> extends React.Component<DropdownProps<T>, DropdownState> {
  constructor(props: DropdownProps<T>) {
    super(props);

    this.state = {
      isActive: false,
    };
  }

  showMenu: React.MouseEventHandler<HTMLButtonElement> = event => {
    event.preventDefault();

    this.setState({ isActive: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }

  closeMenu = () => {
    this.setState({ isActive: false }, () => {
      document.removeEventListener('click', this.closeMenu);
    });
  }

  onClickDropdownItem = (value: T) => {
    this.closeMenu();
    const { onChange } = this.props;
    onChange && onChange(value);
  }

  render() {
    const { isActive } = this.state;
    const { label, labelClassName, buttonClassName, items } = this.props;
    return (
      <>
        <button className={classNames('filter-bar-dropdown-button', buttonClassName)} onClick={this.showMenu}>
          <div className={classNames(labelClassName)}>{label}</div>
          <div className="filter-bar-dropdown-toggle-arrow">
            <Icon icon={FilterBarIcons.DropDownArrow} />
          </div>
        </button>

        <ul className={classNames('filter-bar-dropdown-menu', { 'active': isActive })}>
          {
            items && items.map((item, index) =>
              <li key={index} className="filter-bar-dropdown-menu-item">
                <a className="filter-bar-dropdown-menu-item-link" onClick={e => this.onClickDropdownItem(item.value)}>
                  <div>
                    {item.option}
                  </div>
                </a>
              </li>
            )
          }
        </ul>
      </>
    );
  }
}