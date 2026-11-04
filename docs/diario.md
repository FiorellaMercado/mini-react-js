
## dia 1:
**Hice:** Realicé dos funciones uno para crear un elemto html *createElement* y otro para dibujarlo dentro de un elemnto contenedor *render*


**Problemas:** Al principio no consideré un prop nulo en createElement y en render el manejo de valores numericos y no lo texto


**Decisiones:**
- Agregué esta condición `props || {}` en createElement: JSX pasa `null` cuando un elemento no tiene atributos, y no se puede recorrer `null`.
- Aceptar también `number` en render: `typeof 3` no es `"string"`, así que el `3` se trataba como elemento virtual y daba error.
- Usé Vite en lugar de Webpack/Babel: menos configuración.

**Pendiente:** render no actualiza un elemento que ya existe sino que crea uno nuevo



## día 2:
**Hice:** Hice que render ya no borre todo para dibujar de nuevo, sino que compare lo que había con lo nuevo y cambie solo lo que es distinto. Para eso creé tres funciones: *crearNodo* (arma un elemento real a partir de uno virtual), *cambio* (dice si hay que reemplazar un elemento por otro) y *actualizar* (compara y arregla solo lo necesario). Ahora render se acuerda de lo último que dibujó.


**Problemas:**
- Al principio render solo agregaba, entonces al llamarlo dos veces se dibujaban dos h1. Lo primero que probé fue vaciar el contenedor, pero así se borra todo aunque cambie una sola cosa.
- En crearNodo leía las props del lugar equivocado (`elementoVirtual[atributo]` en vez de `elementoVirtual.props[atributo]`).
- En `cambio` usaba `!nodoA` para saber si no existía, pero eso también da `true` con el número `0` y con el texto vacío. Lo cambié a `== null`.
- Al reemplazar un elemento, asignar el nodo nuevo a una variable (`nodoReal = ...`) no cambia la pantalla. Hay que decírselo al padre con `replaceChild`.
- En una prueba llamé a render con el orden al revés y parecía que funcionaba mal. Aprendí que lo "viejo" es lo que se dibujó en la llamada anterior, no el nombre de la variable.
- Cuando una lista pasaba de 3 elementos a 1 daba error en `removeChild`: al quitar un elemento, los siguientes se corren de posición y el bucle contaba con las posiciones de antes.


**Decisiones:**
- Separé crear el elemento de agregarlo a la página (`montar` pasó a ser `crearNodo`, que solo devuelve el elemento). Así `actualizar` puede decidir si lo agrega o lo reemplaza.
- `cambio` solo compara el tipo (h1, p, etc.), no las props ni los hijos. Si el tipo es igual se reutiliza el elemento y se revisa por dentro.
- `actualizar` compara posición por posición. Hay cuatro casos: no había nada (crear), ya no hay nada (quitar), son distintos (reemplazar) o son del mismo tipo (actualizar props y revisar los hijos).
- Para los hijos hay dos bucles: uno hacia adelante para comparar y agregar, y otro de atrás hacia adelante para quitar los que sobran. Así quitar uno no mueve a los demás.


**Pendiente:** Falta el estado, Flux y la app de tareas.

## día 3:
**Hice:** Agregué Flux con una función *createStore* (guarda el estado y tiene *getState*, *dispatch* y *subscribe*) y la conecté con render para hacer un contador que se actualiza solo. También hice que se puedan usar componentes (funciones que devuelven JSX, como `<Saludo nombre="Ana" />`), con una función *expandir* que los convierte en etiquetas normales antes de comparar.


**Problemas:**
- Usé `store` y `root` antes de definirlos.
- Escribí `onClick` como en React y no funcionó: como las props se asignan directo al DOM, hay que usar `onclick` en minúscula.
- Los hijos de un componente llegaban como una lista dentro de otra lista y daba error en crearNodo.
- Al cambiar las props de un componente, el diff no cambiaba nada en pantalla, porque el componente no tiene hijos hasta que se ejecuta.


**Decisiones:**
- El store es del framework, pero el reducer y las acciones son de cada app.
- En `createElement` usé `children.flat()` para desarmar las listas de hijos.
- Un componente recibe un solo objeto con sus props y `children`.
- *expandir* se ejecuta en render antes del diff y se guarda el árbol ya expandido. Así actualizar compara etiquetas normales y no hizo falta cambiarlo.


**Pendiente:** Hacer la app de tareas y probar el mini framework.