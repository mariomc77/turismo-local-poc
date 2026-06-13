export default function SearchBar({ value, onChange, placeholder = "Buscar..." }) { return ( <div className="search-box">
<span></span>
<input type="text" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
</div> ); }