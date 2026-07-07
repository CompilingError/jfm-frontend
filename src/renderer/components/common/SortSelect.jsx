import './SortSelect.css';

function SortSelect({ label, value, options, onChange, disabled }) {
  return (
    <label className="sort-select">
      <span>{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default SortSelect;