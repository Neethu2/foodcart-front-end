import axios from "axios";
import { useEffect, useState } from "react";

const Home = () => {
  const [search, setSearch] = useState("");
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => setList(res.data))
      .catch((err) => console.log(err));
  }, [search]);
  const handleSearch = (e: any) => {
    console.log(e.target.value);
    setSearch(e.target.value);
    axios
      .get(`https://jsonplaceholder.typicode.com/users?q=${e.target.value}`)
      .then((res) => setList(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <input
        type="search"
        placeholder="Search..."
        value={search}
        onChange={(e) => handleSearch(e)}
      />
      <ul>
        {list.map((item) => {
          return (
            <li key={item.id}>
              <p>{item.name}</p>
              <p>{item.email}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Home;
