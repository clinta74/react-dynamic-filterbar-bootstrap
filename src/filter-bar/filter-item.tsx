import React from 'react';
import { FilterBarIcons } from '../filter-bar-icons';
import { Icon } from 'react-svg-icon-host';
import classNames from 'classnames';

import { FilterBars, Logics } from '../index'

interface IFilterItemProps<Tobj> {
  field: FilterBars.FitlerQueryField<Tobj>,
  filter: JSX.Element,
  label: string,
  labelClassName?: string,
  onRemoveFilter: FilterBars.RemoveFilterHandler<Tobj>,
}

export const FilterItem:React.FunctionComponent<IFilterItemProps<{}>> = ({ filter, onRemoveFilter, labelClassName, label }) =>{
  const { field } = filter.props;
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