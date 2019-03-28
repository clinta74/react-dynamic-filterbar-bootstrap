import React from 'react';
import { FilterBarIcons } from '../filter-bar-icons';
import { Icon } from 'react-svg-icon-host';

export type RemoveFilterHandler = (field: string) => void;

interface IFilterItemProps {
  field: string
  filter: JSX.Element;
  onRemoveFilter: RemoveFilterHandler;
}

export const FilterItem: React.FunctionComponent<IFilterItemProps> = ({ filter, onRemoveFilter }) => {
  const { field } = filter.props;
  return (
    <div className="filter-bar-item">
      {filter}
      <button type="button" className="filter-bar-remove-item" onClick={e => onRemoveFilter(field)}>
        <Icon icon={FilterBarIcons.TimesCircle} />
      </button>
    </div>
  );
}