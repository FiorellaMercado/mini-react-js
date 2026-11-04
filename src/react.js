export function createElement(type,props,...children){
    const objeto={
        type:type,
        props: props || {},
        children: children.flat()
    }
    return objeto
}


let arbolViejo = null
export function render(nuevo, contenedor){ 
    const arbol=expandir(nuevo)
    actualizar(contenedor, arbol, arbolViejo, 0)
    arbolViejo=arbol
}

function cambio(nodoA, nodoB){

    if(nodoA==null || nodoB== null){
        if(nodoA == null && nodoB == null){  // == null da true cuando es null o undefined
            return false
        }else{
            return true
        }

    }

    if(typeof nodoA === "object" || typeof nodoB === "object"){
        if(typeof nodoA !== typeof nodoB){
            return true
        }
    }
    
    if((typeof nodoA === "string" || typeof nodoA === "number" )&& (typeof nodoB === "string" || typeof nodoB === "number")){
        if(String(nodoA)!== String(nodoB)){
            return true
        }
    }

    if(typeof nodoA === "object" && typeof nodoB === "object"){
        if(nodoA.type !== nodoB.type){
            return true
        }
    }
    return false
}

function crearNodo(elementoVirtual){
    if(typeof elementoVirtual === "string" || typeof elementoVirtual === "number"){
        const nodoTexto = document.createTextNode(elementoVirtual)
        return nodoTexto
    }
    if(typeof elementoVirtual.type === "function"){
        const resultado= elementoVirtual.type({...elementoVirtual.props, children : elementoVirtual.children})
        return crearNodo(resultado)
    }
    const nodo=document.createElement(elementoVirtual.type)
    for(const atributo in elementoVirtual.props){
        nodo[atributo]=elementoVirtual.props[atributo]
    }
    for(const hijo of elementoVirtual.children){
        nodo.appendChild(crearNodo(hijo))
    }
    return nodo
}


function expandir(elemento){
    if(typeof elemento === "string" || typeof elemento === "number" || elemento == null){
        return elemento
    }
    if(typeof elemento.type === "function"){
        const resultado= elemento.type({...elemento.props, children : elemento.children})
        return expandir(resultado)
    }
    const hijosExpandidos= elemento.children.map(hijo=> expandir(hijo))

    return {...elemento, children: hijosExpandidos}

}
export function actualizar(padre,nuevo,viejo, indice ){
    const nodoReal=padre.childNodes[indice]

    if(viejo == null){
        padre.appendChild(crearNodo(nuevo))
        return
    }
    if(nuevo == null){
        padre.removeChild(nodoReal)
        return
    }
    if(cambio(nuevo,viejo)){
        padre.replaceChild(crearNodo(nuevo), nodoReal)
        return 
    }
    
    if (typeof nuevo === "string" || typeof nuevo === "number") {
        return   // caso particular
    }

    for(const atributo in nuevo.props){
        nodoReal[atributo]=nuevo.props[atributo]
    }

    for (let i = 0; i < nuevo.children.length; i++) {
        actualizar(nodoReal, nuevo.children[i], viejo.children[i], i)
    }

    for (let i = viejo.children.length - 1; i >= nuevo.children.length; i--) {
        nodoReal.removeChild(nodoReal.childNodes[i])
    }
    
}


export function createStore(reducer, estadoInicial){
    let estado = estadoInicial
    const suscriptores= []

    function getState(){
        return estado
    }

    function dispatch(accion){
        estado = reducer(estado,accion)
        for(const subscriptor of suscriptores){
            subscriptor()
        }

    }

    function subscribe(funcion){
        suscriptores.push(funcion)
    }
    return {getState, dispatch, subscribe}
}

