export const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#272626",
    borderColor: "#272626",
    color: "#FFFFFF",
    boxShadow: "none",
    "&:hover": { borderColor: "#272626" },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "white",
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected ? "white" : isFocused ? "#f0f0f0" : "white",
    color: isSelected ? "black" : "black",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#FFFFFF",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#FFFFFF",
    fontSize: "18px",
    fontWeight: "500",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#CC5600",
    padding: "10px",
    "&:hover": { color: "#CC5600" },
  }),
  indicatorsContainer: (base) => ({
    ...base,
    color: "#CC5600",
    backgroundColor: "transparent",
    padding: "0",
  }),
  indicatorSeparator: (base) => ({
    display: "none",
  }),
};
