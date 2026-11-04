
import { createElement, render, actualizar, createStore} from "./src/react.js"

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

// //Prueba 5  -  render actualiza un elemento?
// render(<h1>Primero</h1>, document.getElementById("root"))
// render(<h1>Segundo</h1>, document.getElementById("root"))


// //Prueba 6  -  nueva funcion render 
// render(<h1>Primero</h1>, document.getElementById("root"))
// render(<h1>Segundo</h1>, document.getElementById("root"))

// // Prueba 7  -  nueva funcion render, la recursion funciona?
// const arbol2 = (
//   <div>
//     <h1 className="titulo">Hola</h1>
//     <p>Tienes 3 tareas</p>
//   </div>
// )

// render(arbol2, document.getElementById("root"))

// console.log(cambio("3", 3))                          
// console.log(cambio("Hola", "Chau"))                          
// console.log(cambio("Hola", createElement("p", null)))        
// console.log(cambio(createElement("h1", null), createElement("p", null)))   
// console.log(cambio(createElement("p", null, "a"), createElement("p", null, "b"))) 


// //Prueba 8   -  funcion actualizar 

// const root = document.getElementById("root")


// const viejo = <ul><li>A</li><li>B</li></ul>
// const nuevo = <ul><li>A</li><li>C</li></ul>

// render(viejo, root)
// setTimeout(() =>
//     actualizar(root, nuevo, viejo, 0), 2000
// ) // para poder ver el cambio


// //Prueba 9   -  funcion render nueva

// const root = document.getElementById("root")


// const viejo = <ul><li>A</li><li>B</li></ul>
// const nuevo = <ul><li>A</li><li>C</li></ul>
    
// render(viejo, root)  
// setTimeout(() =>
//     render(nuevo, root), 2000
// ) // para poder ver el cambio

// // prueba 10   -  lista que crece 

// const root = document.getElementById("root")


// const viejo = <ul><li>A</li></ul>
// const nuevo = <ul><li>A</li><li>B</li></ul>
    
// render(viejo, root)  
// setTimeout(() =>
//     render(nuevo, root), 2000
// ) // para poder ver el cambio


// // prueba 11   -  cambio de props

// const root = document.getElementById("root")

// const viejo = <h1 className="a">Hola</h1> 
// const nuevo =  <h1 className="b">Hola</h1>
    
// render(viejo, root)  
// setTimeout(() =>
//     render(nuevo, root), 2000
// ) // para poder ver el cambio


// // prueba 12   - cambio de etiqueta

// const root = document.getElementById("root")


// const viejo = <h1>Hola</h1>
// const nuevo =  <p>Hola</p>
    
// render(viejo, root)  
// setTimeout(() =>
//     render(nuevo, root), 2000
// ) // para poder ver el cambio


// // prueba 13   - lista que se achica

// const root = document.getElementById("root")


// const viejo = <ul><li>A</li><li>B</li><li>C</li></ul>
    
// const nuevo = <ul><li>A</li></ul>

// render(viejo, root)  
// setTimeout(() =>
//     render(nuevo, root), 2000
// ) // para poder ver el cambio


// prueba 14   -  flux  por consola (store sin pantalla)
// const store = createStore(reducer, { contador: 0 })

// store.subscribe(() => console.log("cambió:", store.getState()))

// store.dispatch({ type: "SUMAR" })
// store.dispatch({ type: "SUMAR" })
// store.dispatch({ type: "OTRA" })


// Prueba 15 - contador con Flux: store + render con diff

const root = document.getElementById("root")

function reducer(estado, accion){
    if(accion.type === "SUMAR"){
        return {contador: estado.contador+1}
    }
    if (accion.type === "RESTAR"){
        return {contador: estado.contador-1}
    }

    return estado
}

const store = createStore(reducer, { contador: 0 })

function App(){
    const estado = store.getState()
    return(
        <div>
            <h1> {estado.contador}</h1>
            <button onclick={()=> store.dispatch({type: "SUMAR"})}>+</button>
            <button onclick={()=> store.dispatch({type: "RESTAR"})}>-</button>

        </div>
    )
}

function pintar(){
    render(App(), root)
}

pintar()                 // dibuja la primera vez
store.subscribe(pintar) 

