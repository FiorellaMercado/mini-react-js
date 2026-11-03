## createElement(type, props, ...children)

Crea un elemento virtual, un objeto plano. No toca el DOM.

| Parámetro | Descripción |
|---|---|
| type | Tipo de elemento: "h1", "div", "p", ... |
| props | Objeto con atributos, o `null` si no hay |
| ...children | Cero o más hijos: texto, números u otros elementos virtuales |

**Devuelve:** { type, props, children }

```js
createElement("h1", { className: "titulo" }, "Hola")
```

## render(nuevo, contenedor)

Dibuja un elemento virtual en el contenedor. No devuelve nada.

La primera vez, crea todos los nodos. Las siguientes, compara el árbol nuevo con el que dibujó la vez anterior (**diff**) y modifica en el DOM solo lo que cambió, sin borrar ni recrear el resto.

Las props se asignan directo al nodo del DOM, así que se usan los nombres del DOM, ejemplo: `className`, no `class`.

| Parámetro | Descripción |
|---|---|
| nuevo | Texto, número u objeto plano de tipo `{ type, props, children }` |
| contenedor | Elemento HTML donde se dibuja |

```js
const root = document.getElementById("root")

render(createElement("p", null, "Hola"), root)

// Más tarde: solo se actualiza el texto, el <p> se conserva
render(createElement("p", null, "Chau"), root)
```

## Funciones internas

Son las que hacen el trabajo de `render`.

| Función | Qué hace |
|---|---|
| crearNodo(elementoVirtual) | Construye un nodo real del DOM (con sus props e hijos) a partir de un elemento virtual y lo devuelve, sin agregarlo a la página |
| cambio(nodoA, nodoB) | Devuelve `true` si hay que **reemplazar** un nodo por otro: uno existe y el otro no, tipos distintos (texto vs. elemento), textos con distinto contenido o etiquetas distintas. Solo compara el tipo, no las props ni los hijos |
| actualizar(padre, nuevo, viejo, indice) | Compara `nuevo` con `viejo` en una posición y aplica el cambio mínimo en el DOM |

### Cómo decide actualizar

Compara posición por posición, bajando por el árbol:

| Situación | Acción en el DOM |
|---|---|
| viejo no existe | Crear el nodo y agregarlo |
| nuevo no existe | Quitar el nodo |
| cambio da true | Reemplazar el nodo por uno nuevo |
| Mismo tipo | Reutilizar el nodo: actualizar sus props y repetir con cada hijo |

Al comparar los hijos se recorre en **dos partes**: primero hacia adelante por las posiciones del árbol nuevo (comparar, actualizar o agregar) y después **de atrás hacia adelante** para quitar los hijos que sobran. Así, quitar un nodo no mueve las posiciones de los que faltan por quitar.

## Limitaciones actuales

- render recuerda **un solo** árbol anterior, así que está pensado para un único contenedor.
- La comparación es **por posición**, no hay `key`. Si se borra un elemento del medio de una lista, los siguientes se comparan con el elemento equivocado y se actualizan en lugar de quitarse.
- Si un elemento pierde una prop, esa prop no se elimina del nodo real.
- No hay manejo de eventos, estado ni Flux todavía.
- Los hijos null, undefined y booleanos no están soportados en crearNodo.