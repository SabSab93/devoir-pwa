# TP — Async/Await & PWA avec Workbox

## Exercice 1 — Callbacks → Async/Await


### Consignes

1. Transformer chaque fonction (`getUser`, `getOrders`, `computeTotal`) en **Promise**.
```js
function getUser(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!userId) {
        reject(new Error("userId manquant"));
      } else {
        resolve({
          id: userId,name: "Alice", email: "alice@example.com"
        });
      }
    }, 300);
  });
}
```

```js
function getOrders(user) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!user) {
        reject(new Error("Utilisateur introuvable"))
      } else {
        resolve([
      { id: 1, product: "Laptop", price: 999 },
      { id: 2, product: "Souris", price: 29 },
      { id: 3, product: "Clavier", price: 79 },
    ]);
      }
    }, 400);
  });
}
```

```js
function computeTotal(orders) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!orders || orders.length === 0) {
        reject(new Error("Aucune commande"));
      } else {
        const total = orders.reduce((acc, o) => acc + o.price, 0);
        resolve(total);
      }
    }, 200);
  });
}
```

2. Écrire une fonction `processUser(userId)` en **async/await** qui orchestre les trois appels.
3. Gérer les erreurs avec un `try/catch`.
```js
async function processUser(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user);
    const total = await computeTotal(orders);

    console.log(`Total des achats de ${user.name} : ${total}€`);
  } catch (error) {
    console.error("Erreur :", error.message);
  }
}
```



---
## Exercice 2 — Then/Catch → Async/Await


1. Réécrire `fetchJokes` en **async/await** sans `.then()` ni `.catch()` dans le corps de la fonction.
2. Conserver exactement la même logique : vérification du statut HTTP, filtre par type, mapping, affichage.
3. Gérer les erreurs avec `try/catch` et retourner `[]` en cas d'échec, comme l'original.
4. La signature de la fonction doit rester `fetchJokes()` (aucun paramètre).
```ts
async function fetchJokes() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const jokes = await response.json();
    const filtered = jokes.filter((joke) => joke.type === "general");
    const formatted = filtered.map((joke) => ({
      id: joke.id,
      question: joke.setup,
      answer: joke.punchline,
    }));
    formatted.forEach((joke) => {
      console.log(`Q: ${joke.question}`);
      console.log(`R: ${joke.answer}`);
      console.log("---");
    });
    return formatted;

  } catch (err) {
    console.error("Impossible de récupérer les blagues :", err.message);
    return [];
  }
}
fetchJokes();
```

5. Appeler 2 fois `fetchJokes()` en parallèle et afficher les résultats combinés.


## Exercice 3 — PWA : News Dev.to avec Vite PWA & Stale-While-Revalidate

App.tsx
