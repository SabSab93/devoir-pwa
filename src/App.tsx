import { useState } from "react";

type Article = {
  id: number;
  title: string;
  published_at: string;
  user: {
    name: string;
  };
  tag_list: string[];
};

const ResultArticle = () => {
  const [results, setResults] = useState<Article[]>([]);

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
  const formatdate = (published_at: string) => {
    return new Date(published_at).toLocaleString("en-GB").replace(",", "");
  };

  const listItems = results.map((item) => (
    <li key={item.id}>
      {item.title} - {formatdate(item.published_at)} - {item.user.name} -
      {item.tag_list.join(", ")}
    </li>
  ));

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
