import { MenuItem, Select as MuiSelect, SelectProps as MuiSelectProps } from "@mui/material";
import { ReactNode, SelectHTMLAttributes } from "react";

interface SelectProps {
  value: SelectHTMLAttributes<HTMLSelectElement>["value"],
  onChange: MuiSelectProps<any>["onChange"],
  valueLabelRecord: Record<string, string>
  defaultValue?: SelectHTMLAttributes<HTMLSelectElement>["defaultValue"]
  renderValue?: (value: string | number) => ReactNode
  className?: string
  menuItemRender?: (item: string | number) => ReactNode
}

export function Select(props: SelectProps) {
  const { menuItemRender, renderValue, className = "", defaultValue, valueLabelRecord, value, onChange } = props;
  return <MuiSelect
    value={value}
    defaultValue={defaultValue}
    className={`pl-2 bold rounded-sm bg-gray-900 ${className}`}
    renderValue={(valueToRender) =>
    (
      <div className="SelectRenderedValue font-semibold text-gray-200 capitalize rounded-md">
        {renderValue ? renderValue(valueToRender as string) : valueLabelRecord[valueToRender as string]}
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
    {Object.entries(valueLabelRecord).map(([itemValue, itemLabel]) => (
      <MenuItem
        className="capitalize"
        key={itemValue}
        value={itemValue}
      >
        {menuItemRender ? menuItemRender(itemValue) : itemLabel}
      </MenuItem>
    ))}
  </MuiSelect>
}