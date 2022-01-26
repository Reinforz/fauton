import { MenuItem, Select as MuiSelect, SelectProps as MuiSelectProps } from "@mui/material";
import { ReactNode, SelectHTMLAttributes } from "react";

interface SelectProps {
  value: SelectHTMLAttributes<HTMLSelectElement>["value"],
  onChange: MuiSelectProps<any>["onChange"],
  valueLabelRecord: Record<string, string>
  renderValue?: (value: string | number) => ReactNode
  className?: string
  menuItemRender?: (item: string | number) => ReactNode
}

export function Select(props: SelectProps) {
  const { menuItemRender, renderValue, className = "", valueLabelRecord, value, onChange } = props;
  const items = Object.entries(valueLabelRecord);
  return <MuiSelect
    value={value}
    className={`pl-2 bold rounded-sm bg-gray-900 ${className}`}
    renderValue={(valueToRender) =>
    (
      <div className="SelectRenderedValue font-semibold capitalize rounded-md">
        {renderValue ? renderValue(valueToRender as string) : valueLabelRecord[valueToRender as string]}
      </div>
    )
    }
    disabled={items.length === 0}
    sx={{
      "& .MuiSvgIcon-root": {
        fill: `white`
      },
    }}
    onChange={onChange}
  >
    {items.length !== 0 ? items.map(([itemValue, itemLabel]) => (
      <MenuItem
        className="capitalize"
        key={itemValue}
        value={itemValue}
      >
        {menuItemRender ? menuItemRender(itemValue) : itemLabel}
      </MenuItem>
    )) : null}
  </MuiSelect>
}