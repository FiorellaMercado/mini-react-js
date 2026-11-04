## createElement(type, props, ...children)

Crea un elemento virtual, un objeto plano. No toca el DOM.

| Parámetro | Descripción |
|---|---|
| type | Tipo de elemento: "h1", "div", "p", ... o una **función** (componente) |
| props | Objeto con atributos, o `null` si no hay |
| ...children | Cero o más hijos: texto, números u otros elementos virtuales. Si algún hijo es una lista, se aplana un nivel |

**Devuelve:** { type, props, children }

```js
createElement("h1", { className: "titulo" }, "Hola")
```

## render(nuevo, contenedor)

Dibuja un elemento virtual en el contenedor. No devuelve nada.

Primero convierte los componentes en etiquetas normales (con `expandir`). La primera vez, crea todos los nodos. Las siguientes, compara el árbol nuevo con el que dibujó la vez anterior (**diff**) y modifica en el DOM solo lo que cambió, sin borrar ni recrear el resto.

Las props se asignan directo al nodo del DOM, así que se usan los nombres del DOM, ejemplo: `className`, no `class`.

| Parámetro | Descripción |
|---|---|
| nuevo | Texto, número, componente u objeto plano de tipo `{ type, props, children }` |
| contenedor | Elemento HTML donde se dibuja |

```js
const root = document.getElementById("root")

render(createElement("p", null, "Hola"), root)

// Más tarde: solo se actualiza el texto, el <p> se conserva
render(createElement("p", null, "Chau"), root)
```

## createStore(reducer, estadoInicial)

Crea un store: un único lugar donde vive el estado de la app (arquitectura **Flux**). El estado solo cambia enviando una **acción** con `dispatch`, y el `reducer` decide cómo queda el estado nuevo.

| Parámetro | Descripción |
|---|---|
| reducer | Función `(estado, accion)` que devuelve el estado **nuevo** sin modificar el anterior. Si no reconoce la acción, devuelve el estado igual |
| estadoInicial | Estado con el que arranca el store |

**Devuelve:** { getState, dispatch, subscribe }

| Método | Qué hace |
|---|---|
| getState() | Devuelve el estado actual |
| dispatch(accion) | Pasa la acción por el reducer, guarda el estado nuevo y avisa a todos los suscriptores. Una acción es un objeto con un `type` (el nombre de lo que pasó) y, si hace falta, más datos |
| subscribe(funcion) | Guarda una función a la que se llamará cada vez que se haga `dispatch` |

El reducer pertenece a la **aplicación**, no al framework: cada app define sus propias acciones.

```js
function reducer(estado, accion) {
  if (accion.type === "SUMAR") return { contador: estado.contador + 1 }
  if (accion.type === "RESTAR") return { contador: estado.contador - 1 }
  return estado
}

const store = createStore(reducer, { contador: 0 })

function pintar() {
  render(<App />, root)
}

pintar()                 // dibuja la primera vez
store.subscribe(pintar)  // cada cambio de estado vuelve a dibujar
```

Flujo completo: clic, `dispatch`, reducer, estado nuevo, aviso a los suscriptores, `render` y diff.

## Componentes

Un componente es una **función** que recibe `props` y devuelve un elemento virtual (JSX). Se usa como una etiqueta: `<Saludo nombre="Ana" />`.

Recibe un solo objeto con todas las props, más `children` con los hijos del componente (siempre una lista).

```jsx
function Saludo(props) {
  return <h1>Hola {props.nombre}</h1>
}

function Caja(props) {
  return <div className="caja">{props.children}</div>
}

render(
  <Caja>
    <Saludo nombre="Ana" />
  </Caja>,
  root
)
```

Los componentes pueden devolver otros componentes. No tienen estado propio: el estado vive en el store.

## Funciones internas

Son las que hacen el trabajo de `render`.

| Función | Qué hace |
|---|---|
| expandir(elemento) | Recorre el árbol y reemplaza cada componente por lo que devuelve al llamarlo, hasta que solo quedan etiquetas normales. Devuelve un árbol nuevo sin modificar el original. Se llama antes del diff para que `actualizar` compare `h1` contra `h1` y no componentes (que no tienen hijos propios hasta que se ejecutan) |
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
- Los eventos se escriben en minúscula (`onclick`, no `onClick`), porque las props se asignan directo al nodo del DOM.
- Los componentes no tienen estado propio: el estado vive en el store.
- `createElement` aplana las listas de hijos solo **un nivel**.
- Los hijos null, undefined y booleanos no están soportados en crearNodo ni en expandir.
- El store avisa a los suscriptores en cada `dispatch`, aunque el estado no haya cambiado, y no hay forma de desuscribirse.