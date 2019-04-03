import React from 'react';
import { FilterBarIcons } from '../filter-bar-icons';
import { Icon } from 'react-svg-icon-host';
import classNames from 'classnames';

import { FilterBars, RemoveFilterHandler } from '../index'

interface IFilterItemProps<Tobj> {
  field: FilterBars.FitlerQueryField<Tobj>,
  filter: JSX.Element,
  label: string,
  labelClassName?: string,
  onRemoveFilter: RemoveFilterHandler<Tobj>,
}

export class FilterItem<Tobj> extends React.Component<IFilterItemProps<Tobj>> {
  render() {
    const { filter, onRemoveFilter, labelClassName, label, field } = this.props;
    return (
      <div className="filter-bar-item">
        <label className={classNames('filter-bar-label', labelClassName)}>{label}</label>
        {filter}
        <button type="button" className="filter-bar-remove-item" onClick={e => onRemoveFilter(field)}>
          <Icon icon={FilterBarIcons.TimesCircle} />
        </button>
      </div>
    );
  }
}