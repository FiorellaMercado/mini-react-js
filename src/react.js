export function createElement(type,props,...children){
    const objeto={
        type:type,
        props: props || {},
        children: children
    }
    return objeto
}

export function render(elementoVirtual, contenedor){
    if (typeof elementoVirtual === "string" || typeof elementoVirtual === "number"  ){
        const texto = document.createTextNode(elementoVirtual)
        contenedor.appendChild(texto)
        return
    }
    const nodo = document.createElement(elementoVirtual.type)

    for (const clave in elementoVirtual.props){
        nodo[clave]= elementoVirtual.props[clave]
    }

    for (const item of elementoVirtual.children){
        render(item, nodo)
    }

    contenedor.appendChild(nodo)

}

