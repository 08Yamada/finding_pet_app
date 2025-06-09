import { useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";

const types = ["Name", "rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "Name",
    location: "",
    minPrice: 0,
    maxPrice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };
  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      <form>
        <input
          type="text"
          name="kind"
          placeholder="種類"
          onChange={handleChange}
        />
        <input
          type="number"
          name="name"
          placeholder="名前"
          onChange={handleChange}
        />
        {/* <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="Max Price"
          onChange={handleChange}
        /> */}
        <Link to = {`/list?type=${query.type}&kind=${query.kind}&name=${query.name}`}>
          <button>
            <img src="/search.png" alt="" />
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
