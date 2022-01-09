import { useRef } from "react";

const Options = ({ setInput, optionList }) => {
  const selectMenuRef = useRef();

  const handleSelect = () => {
    const menu = selectMenuRef.current;
    setInput(menu.options[menu.selectedIndex].text);
  };
  return (
    <div>
      <select ref={selectMenuRef} onChange={handleSelect}>
        {!optionList?.length ? (
          <option>Seçenekler</option>
        ) : (
          optionList?.map((option) => {
            return (
              <option key={option} className="option" value={option}>
                {option}
              </option>
            );
          })
        )}
      </select>
    </div>
  );
};

export default Options;
