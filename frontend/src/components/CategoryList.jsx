import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(setCategories);
  }, []);

  return (
    <ul>
      {categories.map(cat => (
        <li key={cat._id}>
          <Link to={`/category/${cat.name}`}>
            {cat.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
