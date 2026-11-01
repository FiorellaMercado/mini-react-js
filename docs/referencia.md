## createElement(type, props, ...children)

Crea un elemento virtual, un objeto plano. No toca el DOM.

| Parámetro | Descripción |
|---|---|
| type | Tipo de elemento: "h1", "div", "p", ... |
| props | Objeto con atributos, o null si no hay |
| ...children | Cero o más hijos: texto, números u otros elementos virtuales |

**Devuelve:** `{ type, props, children }`

```js
createElement("h1", { className: "titulo" }, "Hola")
```

## render(elementoVirtual, contenedor)

Convierte un elemento virtual en nodos del DOM, no devuelve nada.


**Es recursiva:** recorre todo el árbol de hijos.

De momento agrega al contenedor sin borrar lo que ya hay.

Las props se asignan directo al nodo del DOM, así que se usan los nombres del DOM, ejemplo: (className, no class).

| Parámetro | Descripción |
|---|---|
| elementoVirtual | Texto, número o objeto plano de tipo { type, props, children }  |
| contenedor | Elemento html que contendrá a los hijos|


```js
render(
  createElement("p", null, "Hola"),
  document.getElementById("root")
)
```

