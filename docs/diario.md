
## dia 1:
**Hice:** Realicé dos funciones uno para crear un elemto html *createElement* y otro para dibujarlo dentro de un elemnto contenedor *render*


**Problemas:** Al principio no consideré un prop nulo en createElement y en render el manejo de valores numericos y no lo texto


**Decisiones:**
- Agregué esta condición `props || {}` en createElement: JSX pasa `null` cuando un elemento no tiene atributos, y no se puede recorrer `null`.
- Aceptar también `number` en render: `typeof 3` no es `"string"`, así que el `3` se trataba como elemento virtual y daba error.
- Usé Vite en lugar de Webpack/Babel: menos configuración.

**Pendiente:** render no actualiza un elemento que ya existe sino que crea uno nuevo