import { useState, ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";

const SearchBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get("query");
  const [query, setQuery] = useState(queryParam || "");

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    const updatedParams = new URLSearchParams(searchParams.toString());
    updatedParams.set("query", newQuery);
    setSearchParams(updatedParams);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-5 mb-5">
      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        placeholder="Quiz search"
        className="border border-gray-300 p-2 w-[300px] text-center rounded"
      />
    </div>
  );
};

export default SearchBar;
