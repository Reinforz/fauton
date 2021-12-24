import { MenuItem, Select as MuiSelect, SelectProps as MuiSelectProps } from "@mui/material";
import { ReactNode, SelectHTMLAttributes } from "react";

interface SelectProps {
  value: SelectHTMLAttributes<HTMLSelectElement>["value"],
  onChange: MuiSelectProps<any>["onChange"],
  items: (string | number)[]
  defaultValue?: SelectHTMLAttributes<HTMLSelectElement>["defaultValue"]
  renderValue?: (value: string | number) => ReactNode
  className?: string
  menuItemRender?: (item: string | number) => ReactNode
}

export function Select(props: SelectProps) {
  const { menuItemRender, renderValue, className = "", defaultValue, items, value, onChange } = props;
  return <MuiSelect
    value={value}
    defaultValue={defaultValue}
    className={`pl-2 bold rounded-sm bg-gray-900 ${className}`}
    renderValue={(valueToRender) =>
    (
      <div className="SelectRenderedValue font-semibold text-gray-200 capitalize rounded-md">
        {renderValue ? renderValue(valueToRender as string) : valueToRender}
      </div>
    )
    }
    sx={{
      "& .MuiSvgIcon-root": {
        fill: `white`
      },
    }}
    onChange={onChange}
  >
    {items.map((item) => (
      <MenuItem
        className="capitalize"
        key={item}
        value={item}
      >
        {menuItemRender ? menuItemRender(item) : item}
      </MenuItem>
    ))}
  </MuiSelect>
}