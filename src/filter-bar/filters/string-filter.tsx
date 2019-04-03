import React from 'react';
import { get, head, find, first } from 'lodash';
import classNames from 'classnames';

// Local imports
import { FilterBars } from '../../index';
import { Operations, Logics } from '../../enums';
import { Dropdown } from '../../dropdown/dropdown';

type StringFilterProps = {
  showOperator?: boolean,
  className?: string,
  buttonClassName?: string,
}

const stringOperations = [
  {
    operation: Operations.EQ,
    label: 'Equal'
  },
  {
    operation: Operations.CONTAINS,
    label: 'Has'
  },
  {
    operation: Operations.STARTS,
    label: 'Starts with',
  },
  {
    operation: Operations.ENDS,
    label: 'Ends with'
  }
]

export const getDefaultFilterQuery = <Tobj extends {}>(field: FilterBars.FitlerQueryField<Tobj>): FilterBars.FilterQuery<Tobj> => ({
  field,
  logic: Logics.OR,
  filterItems: [{
    operation: Operations.CONTAINS,
    value: '',
  }]
});

const Test:React.SFC<FilterBars.FilterProps<unknown, StringFilterProps>> = <Tobj extends {}, S>(props: FilterBars.FilterProps<Tobj, StringFilterProps>) => {
  const {} = props;
  return (
    <div></div>
  );
}

export class StringFilter<Tobj> extends React.Component<FilterBars.FilterProps<Tobj, StringFilterProps>> {
  public static defaultProps: FilterBars.IGetDefaultFilterQuery<unknown> = {
    getDefaultFilterQuery,
  }

  onChangeValue: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.currentTarget.value;
    const { onFilterUpdate, field: field } = this.props;

    onFilterUpdate && onFilterUpdate({
      field,
      logic: Logics.OR,
      filterItems: [{
        operation: this.getOperation(this.props.filterQuery) || Operations.CONTAINS,
        value: value,
      }],
    })
  }

  onChangeDropdown = (operation: Operations) => {
    const { onFilterUpdate, field: field } = this.props;

    onFilterUpdate && onFilterUpdate({
      field,
      logic: Logics.OR,
      filterItems: [{
        operation: operation,
        value: this.getValue(this.props.filterQuery),
      }]
    })
  }

  getValue = (filterQuery: FilterBars.FilterQuery<Tobj> | undefined): any => {
    return get(head(filterQuery && filterQuery.filterItems), 'value', '');
  }

  getOperation = (filterQuery: FilterBars.FilterQuery<Tobj> | undefined) => {
    return get(head(filterQuery && filterQuery.filterItems), 'operation', Operations.CONTAINS);
  }

  render() {
    const { field, filterQuery, className, label, showOperator, buttonClassName } = this.props;
    const value = this.getValue(filterQuery);
    const operation = this.getOperation(filterQuery);
    const dropdownItems = stringOperations.map(item => ({
      option: item.label,
      value: item.operation,
    }));
    const op = find(stringOperations, i => i.operation === operation) || first(stringOperations);

    return (

      <div className="filter-bar-input-group input-group">
        {
          showOperator &&
          <div className="input-group-prepend">
            <Dropdown items={dropdownItems} label={op ? op.label : ''} buttonClassName={buttonClassName} onChange={this.onChangeDropdown} />
          </div>
        }
        <input className={classNames(className, 'filter-bar-input')} placeholder={label} type="text" name={field.toString()} value={value} onChange={this.onChangeValue} />
      </div>
    );
  }
}