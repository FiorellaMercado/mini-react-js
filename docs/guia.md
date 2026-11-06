# Guía: cómo hacer una app con Mini React

Esta guía es para ver cómo hacer este proyecto, para el detalle de cada función, mira la [referencia técnica](referencia.md).

## 1. Preparar el proyecto

Necesitas Node instalado. El proyecto usa Vite. 

Para instalar y correrlo:

```
npm install
npm run dev
```

El framework es un solo archivo, puedes copiar `src/react.js` a tu proyecto.

## 2. Configurar JSX

Vite transpila el JSX. Hay que decirle que use `createElement` del Mini React. En `vite.config.js` va algo como:

```js
import { defineConfig } from "vite"

export default defineConfig({
  oxc: {
    jsx: {
      runtime: "classic",
      pragma: "createElement",
    },
  },
})
```

Con esto, `<h1>Hola</h1>` se convierte en `createElement("h1", null, "Hola")`.

**Importante:** `createElement` tiene que estar importado en **cada archivo que tenga JSX**:

```js
import { createElement } from "./src/react"
```

## 3. El HTML

Necesitas un contenedor donde se dibuje la app y el script como módulo:

```html
<div id="root"></div>
<script type="module" src="/main.jsx"></script>
```

## 4. Tu primer componente

Un componente es una función que recibe `props` y devuelve JSX. Se usa como una etiqueta:

```jsx
import { createElement, render } from "./src/react"

function Saludo(props) {
  return <h1>Hola {props.nombre}</h1>
}

render(<Saludo nombre="Ana" />, document.getElementById("root"))
```

Los hijos de un componente llegan en `props.children`:

```jsx
function Caja(props) {
  return <div className="caja">{props.children}</div>
}

render(<Caja><Saludo nombre="Ana" /></Caja>, document.getElementById("root"))
```

Reglas del JSX en Mini React (las props se asignan directo al nodo del DOM):
- Los eventos van en **minúscula**: `onclick`, `onsubmit`. `onClick` no funciona.
- No uses `false`, `null` ni `undefined` como hijo. En vez de `{cond ? <p>Hola</p> : false}` escribe `{cond ? <p>Hola</p> : ""}`.
- No hay fragments (`<>...</>`): envuelve siempre en una etiqueta.

## 5. Agregar estado con Flux

El estado no vive en los componentes, vive en un **store**. Flujo completo:

```
clic → dispatch(acción) → reducer → estado nuevo → suscriptores → render + diff
```

### 5.1 Definir el reducer y el store

El reducer es una función `(estado, accion)` que devuelve el estado **nuevo** sin modificar el anterior. Si no reconoce la acción, devuelve el estado igual.

```js
import { createStore } from "./react"

function reducer(estado, accion) {
  if (accion.type === "SUMAR") return { contador: estado.contador + 1 }
  if (accion.type === "RESTAR") return { contador: estado.contador - 1 }
  return estado
}

export const store = createStore(reducer, { contador: 0 })
```

### 5.2 Leer el estado en el componente

```jsx
function App() {
  const estado = store.getState()
  return (
    <div>
      <h1>{estado.contador}</h1>
      <button onclick={() => store.dispatch({ type: "SUMAR" })}>+</button>
      <button onclick={() => store.dispatch({ type: "RESTAR" })}>-</button>
    </div>
  )
}
```

### 5.3 Conectar el store con el render

```jsx
const root = document.getElementById("root")

function pintar() {
  render(<App />, root)
}

pintar()                 // dibuja la primera vez
store.subscribe(pintar)  // cada dispatch vuelve a dibujar
```

`render` compara el árbol nuevo con el anterior y solo toca en el DOM lo que cambió.

## 6. Datos externos

Para llamar a una API, la app usa funciones de acción: hacen el `fetch` y luego hacen `dispatch` con el resultado. Así los componentes nunca llaman a la API directamente.

```js
export async function cargarTareas() {
  try {
    const tareas = await getTareas()
    store.dispatch({ type: "TAREAS_CARGADAS", payload: tareas })
  } catch (e) {
    store.dispatch({ type: "TAREAS_CARGADAS", error: e.message })
  }
}
```

Y el reducer debe manejar tanto el éxito como el error. En la app de tareas, el reducer revisa primero si la acción trae `error`:

```js
function reducer(estado, accion) {
  if (accion.error) {
    return { ...estado, error: accion.error, cargando: false }
  }
  if (accion.type === "TAREAS_CARGADAS") {
    return { ...estado, tareas: accion.payload, cargando: false, error: null }
  }
  // ...
  return estado
}
```

Los componentes que disparan acciones las usan en sus eventos, por ejemplo un botón de borrar:

```jsx
<button onclick={() => deleteTarea(tarea.id)}>Borrar</button>
```

## 7. Ejemplo completo

La app de tareas del segundo repositorio usa todo lo anterior: componentes (`App`, `TaskForm`, `ListTareas`), un store con reducer, acciones asíncronas contra una API y `subscribe(pintar)` en `Main.jsx`.

## 8. Limitaciones a tener en cuenta

- `render` recuerda un solo árbol anterior: sirve para un único contenedor.
- La comparación es por posición, no hay `key`.
- Si un elemento pierde una prop, esa prop no se elimina del nodo real.
- Los componentes no tienen estado propio.
- `createElement` aplana las listas de hijos solo un nivel.
- El store avisa en cada `dispatch`, aunque el estado no cambie, y no hay forma de desuscribirse.

### App de tareas en el siguiente repo:
[tasks-app-with-mini-react](https://github.com/FiorellaMercado/tasks-app-with-mini-react)