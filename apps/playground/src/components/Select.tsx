interface SelectProps {
  disabled?: boolean
  items: string[]
  selectedItem: string
}

export function Select(props: SelectProps) {
  const { items, selectedItem, disabled = false } = props;

  return <div className="flex justify-center">
    <div className="mb-3 xl:w-96">
      <select className="form-select
      appearance-none
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" disabled={disabled}>
        {items.map((item, index) => <option key={item + index.toString()} value={item} selected={item === selectedItem} >{item}</option>)}
      </select>
    </div>
  </div>
}