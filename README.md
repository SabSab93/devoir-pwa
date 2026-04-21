# TP — Async/Await & PWA avec Workbox

## Exercice 1 — Callbacks → Async/Await

### Contexte

Le code ci-dessous simule un pipeline de traitement de données : récupération d'un utilisateur, puis de ses commandes, puis calcul du total de ses achats. Il est écrit en style **callback pyramidal** (callback hell).

### Code de départ

```js
function getUser(userId, callback) {
  setTimeout(() => {
    if (!userId) return callback(new Error("userId manquant"), null);
    callback(null, { id: userId, name: "Alice", email: "alice@example.com" });
  }, 300);
}

function getOrders(user, callback) {
  setTimeout(() => {
    if (!user) return callback(new Error("Utilisateur introuvable"), null);
    callback(null, [
      { id: 1, product: "Laptop", price: 999 },
      { id: 2, product: "Souris", price: 29 },
      { id: 3, product: "Clavier", price: 79 },
    ]);
  }, 400);
}

function computeTotal(orders, callback) {
  setTimeout(() => {
    if (!orders || orders.length === 0)
      return callback(new Error("Aucune commande"), null);
    const total = orders.reduce((acc, o) => acc + o.price, 0);
    callback(null, total);
  }, 200);
}

// Utilisation — callback hell
getUser(42, (err, user) => {
  if (err) {
    console.error("Erreur :", err.message);
    return;
  }
  getOrders(user, (err, orders) => {
    if (err) {
      console.error("Erreur :", err.message);
      return;
    }
    computeTotal(orders, (err, total) => {
      if (err) {
        console.error("Erreur :", err.message);
        return;
      }
      console.log(`Total des achats de ${user.name} : ${total}€`);
    });
  });
});
```

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


4. Le résultat affiché doit être identique à l'original.

---
## Exercice 2 — Then/Catch → Async/Await

### Contexte

Le code suivant consomme une API de blagues (`https://official-joke-api.appspot.com/random_ten`) avec des `.then()/.catch()` chaînés. Il filtre les blagues, les formate, puis les affiche.

### Code de départ

```js
const API_URL = "https://official-joke-api.appspot.com/random_ten";

function fetchJokes() {
  return fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((jokes) => {
      return jokes.filter((joke) => joke.type === "general");
    })
    .then((filtered) => {
      return filtered.map((joke) => ({
        id: joke.id,
        question: joke.setup,
        answer: joke.punchline,
      }));
    })
    .then((formatted) => {
      formatted.forEach((joke) => {
        console.log(`Q: ${joke.question}`);
        console.log(`R: ${joke.answer}`);
        console.log("---");
      });
      return formatted;
    })
    .catch((err) => {
      console.error("Impossible de récupérer les blagues :", err.message);
      return [];
    });
}

fetchJokes();
```

### Consignes

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

### Contexte

Vous allez construire une **PWA** qui affiche les articles tendance de [Dev.to](https://dev.to). Elle doit fonctionner **hors-ligne** grâce à une stratégie de cache **StaleWhileRevalidate** configurée via le plugin **vite-plugin-pwa** (Workbox sous le capot).

API utilisée — publique, sans clé :
```
https://dev.to/api/articles?top=1&per_page=10
```

