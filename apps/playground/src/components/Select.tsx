import styled from "@emotion/styled";
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

const StyledMuiSelect = styled(MuiSelect)`
  padding-left: ${({theme}) => theme.spacing(0.5)};
  border-radius: ${({theme}) => theme.spacing(0.5)};
  font-weight: bold;
`;

const SelectRenderedValue = styled.div`
  font-weight: semi-bold;
  text-transform: capitalize;
  border-radius: ${({theme}) => theme.spacing(0.5)};
`

export function Select(props: SelectProps) {
  const { menuItemRender, renderValue, className = "", valueLabelRecord, value, onChange } = props;
  const items = Object.entries(valueLabelRecord);
  return <StyledMuiSelect
    value={value}
    className={className}
    renderValue={(valueToRender) =>
    (
      <SelectRenderedValue>
        {renderValue ? renderValue(valueToRender as string) : valueLabelRecord[valueToRender as string]}
      </SelectRenderedValue>
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
        sx={{
          textTransform: "capitalize"
        }}
        key={itemValue}
        value={itemValue}
      >
        {menuItemRender ? menuItemRender(itemValue) : itemLabel}
      </MenuItem>
    )) : null}
  </StyledMuiSelect>
}