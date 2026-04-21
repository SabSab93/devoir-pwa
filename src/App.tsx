import { useState } from "react";

const ResultArticle = () => {
  const [results, setResults] = useState([]);

  const getArticles = async () => {
    try {
      const response = await fetch(
        `https://dev.to/api/articles?top=1&per_page=10`,
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Erreur de chargement:", error);
    }
  };
  const listItems = results.map((item) => <li key={item}>{item}</li>);

  return (
    <>
      <button
        onClick={() => {
          getArticles();
        }}
      >
        Click me
      </button>
      <ul>{listItems}</ul>
    </>
  );
};

export default ResultArticle;
