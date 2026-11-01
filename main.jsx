
import { createElement, render } from "./src/react.js"

// // Prueba 1  -  funcion createElement 
// console.log(createElement("h1", { className: "titulo" }, "Hola"))
// console.log(createElement("div", null, createElement("h1", null, "Hola"), createElement("p", null, "Mundo")))


// // Prueba 2  -  funcion render 
// const arbol = createElement("div", null,
//   createElement("h1", { className: "titulo" }, "Hola"),
//   createElement("p", null, "Mundo")
// )

// render(arbol, document.getElementById("root"))

// // Prueba 3 - render con hijo numérico

// render(createElement("p", null, "Tienes ", 3, " tareas"), document.getElementById("root"))

// //Prueba 4   -  render con JSX 
// const arbol2 = (
//   <div>
//     <h1 className="titulo">Hola</h1>
//     <p>Tienes 3 tareas</p>
//   </div>
// )

// render(arbol2, document.getElementById("root"))

//Prueba 5  -  render actualiza un elemento?
render(<h1>Primero</h1>, document.getElementById("root"))
render(<h1>Segundo</h1>, document.getElementById("root"))