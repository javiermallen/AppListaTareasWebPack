import { Tarea } from '../classes/index';
import { listaTareas } from '../index';

//variables cogidas del DOMHTML
//Cojo el input donde escribimos las tareas
const nuevaTarea        = document.querySelector( '.new-todo' );
//Cojo el padre de las li, que es el elemento ul
const ul                = document.querySelector( '.todo-list' );
//Cojo el botón de eliminar completados del HTML
const borrarCompletados = document.querySelector( '.clear-completed' );
//Cojo la lista donde se encuentran los botones que realizan los filtos
const filtros           = document.querySelector( '.filters' );
//Cojo cada uno de los filtros para poder recorrer el vector
const filtrosMarco      = document.querySelectorAll( '.filtro' );
//Cojo el footer para ocultarlo cuando no hay ninguna tarea
const footer            = document.querySelector( '.footer' );
//Cojo el strong donde se muestran el número de tareas pendientes.
let numeroTareasPend    = document.querySelector( 'strong' );

//Funciones
//Función que sirve para que cuando escribamos una tarea se renderize en el HTML
export const anadirTareaHTML = ( tarea ) =>{

    const tareaHTML = `
        <li class="${ ( tarea.completado ) ? 'completed' : '' }" data-id="${ tarea.id }">
            <div class="view">
                <input class="toggle" type="checkbox" ${ (tarea.completado) ? 'checked': '' }>
                <label>${ tarea.tarea }</label>
                <button class="destroy"></button>
            </div>
                <input class="edit" value="Create a TodoMVC template">
        </li>
    `
    ul.innerHTML += tareaHTML;
}

//Función que muestra y oculta el footer en función de si hay tareas o no
export const mostrarFooter = () => {
    //Si hay algo en la lista de Tareas lo muestas y si no lo ocultas
    ( listaTareas.listaTareas.length !== 0 ) ? (footer.classList.remove( 'hidden' )) : (footer.classList.add( 'hidden' ) );
}
//Función que muestra número de elementos pendientes en un span dentro del footer
export const mostrarPendientes = () => {
    const contarPendientes = listaTareas.listaTareas.filter( ( tarea ) => tarea.completado === false );
    numeroTareasPend.textContent = contarPendientes.length;
}
//Función que muestra el botón de eliminar completadas cuando hay tareas ya hechas
export const mostrarBorrarCompletadas = () => {
    const hayCompletadas = listaTareas.listaTareas.filter( ( tarea ) => tarea.completado === true );
    ( hayCompletadas.length > 0 ) ? ( borrarCompletados.classList.remove( 'hidden' ) ) : ( borrarCompletados.classList.add( 'hidden' ));
}


//Eventos
//Evento que al pulsar la tecla enter crea la tarea, añade la tarea al HTML y la añade a la lista de tareas.
nuevaTarea.addEventListener( 'keyup', ( evento ) => {
    //https://keycode.info/
    //Hacemos una condición que será si pulsa la tecla Enter y si hay contenido dentro del cuadro de tipo texto.  Le añadimos el método trim para
    //eliminar los espacios al inicio uy al final.
    if( evento.key === 'Enter' && nuevaTarea.value.trim().length > 0 ){
        //Creo una nueva instancia a la clase tarea
        const nuevaTareaCreada = new Tarea( nuevaTarea.value );
        //Añadimos la nueva tarea al vector
        listaTareas.anadirTarea( nuevaTareaCreada );
        //Añadimos la tarea al HTML
        anadirTareaHTML( nuevaTareaCreada );
        //Borramos el contenido del input de texto
        nuevaTarea.value = '';
    }
    mostrarFooter();
    mostrarPendientes();
    mostrarBorrarCompletadas();
})
//Evento que al marca los elementos como completados y da funcionalidad al botón de borrar
ul.addEventListener( 'click', ( evento ) => {
    //Hacemos click en una de las partes del texto y tenemos que saber donde pulsamos, tenemos una propiedad en el target que se llama
    //localName que nos va a decir donde pulsamos, podremos pulsar en el el checkbox, en el label o en el botón de eliminar, pues tendremos que hacer
    //condiciones según donde pulsemos.
    const nombreElemento    = evento.target.localName;
    //Tengo que coger la li donde hago clic para que cuando pulsemos el botón de eliminar borre toda la tarea
    const tareaSeleccionada = evento.target.parentElement.parentElement;
    //Cojo el id único de cada una de las tareas, este id esta en el atributo de HTML data-id
    const tareaId           = tareaSeleccionada.dataset.id;
    //const tareaId = tareaSeleccionada.getAttribute( 'data-id' );

    //Una vez que tenemos toda la información haremos un condicional, si se pulsa en el check se llama al método marcarCompletado y si 
    //se pulsa el botón de eliminar se llama al método de eliminar tarea
    if( nombreElemento === 'input' ){
        listaTareas.marcarCompletado( tareaId );
        //En el console vemos que va cambiando la propiedad completado pero no tacha la tarea, para hacer eso tenemos que jugar
        //con las clases y añadirle y quitarle la clase completed al li
        tareaSeleccionada.classList.toggle( 'completed' );        
    }
    if( nombreElemento === 'button' ){
        listaTareas.eliminarTarea( tareaId );
        ul.removeChild( tareaSeleccionada );
    }
    mostrarFooter();
    mostrarPendientes();
    mostrarBorrarCompletadas();
});
//Eliminar completados
borrarCompletados.addEventListener( 'click', () => {
    //Llamamos al método de la clase eliminarCompletados
    listaTareas.eliminarCompletados();
    //Recorremos la ul donde están los li, esta es un vector y con la propiedad children puedo sacar el número de elementos
    //Tendremos que recorrer el vector al reves desde el último elemento al primero, porque si lo reccoremos del inicio al final
    //como se borra un elemento las posiciones del vector ya no coinciden
    for( let index = ul.children.length - 1; index >= 0; index-- ){
        //Guardo lo que hay en cada una de las posiciones en una variable
        const elemento = ul.children[ index ];
        //Hago un condicional en el que le digo si contiene la clase completed, si es verdad lo elimino de la lista
        if( elemento.classList.contains( 'completed' ) ){
            elemento.remove();
        }
    }
    mostrarFooter();
    mostrarPendientes();
    mostrarBorrarCompletadas();
});

//Evento para seleccionar los elementos completados y no completados
filtros.addEventListener( 'click', ( evento ) => {
    //Recorremos las a y le quitamo el cuadrado cuando pulsamos en cualquier lado de la ul
    filtrosMarco.forEach( ( filtro ) => filtro.classList.remove( 'selected' ) );
    //Ponemos el marco en el elemento seleccionado
    evento.target.classList.add( 'selected' );
    //Ponemos el texto que tiene el elemento seleccionado en una variable
    const textoFiltroSeleccionado = evento.target.text;
    //Podríamos añadir una medida de seguridad y es que si pulso donde no hay elemento
    //o sea la constante textoFiltroSeleccionado esta vacía que salga del evento
    if( !textoFiltroSeleccionado ){ return }
    //Tenemos que recorrer el vector donde se encuentran las li para saber cuales estan completadas y cuales no
    for( const elemento of ul.children ){
        //El primer paso es quitar a todos los elementos la clase hidden por que si no 
        //el filtro del switch se lo asigna y se quita, además nos servirá para que funcione el botón
        //de Tareas ya que mostrará todas ellas
        elemento.classList.remove( 'hidden' );
        //Según el botón que yo pulse ocultaras la completas o las que no esten completadas
        switch ( textoFiltroSeleccionado ) {
            case 'Pendientes':
                //Comprobamos si el elemento seleccionado tiene la clase "completed", si es así le asignamos
                //la clase del CSS hideen que oculta los elementos con el display none
                if( elemento.classList.contains( 'completed' ) ){
                    elemento.classList.add( 'hidden' );
                }
            break;
            case 'Completadas':
                //Comprobamos si el elemento seleccionado no tiene la clase "completed", si es así le asignamos
                //la clase del CSS hideen que oculta los elementos con el display none
                if( !elemento.classList.contains( 'completed' ) ){
                    elemento.classList.add( 'hidden' );
                }
            break;
        }  
    }
});
//Añado el evento que al hacer doble clic sobre una label automaticamente la pueda modificar añadiendo el
//atributo contentEditable="true"
ul.addEventListener( 'dblclick', ( evento ) => {
    const nombreElemento    = evento.target.localName;
    const tareaSeleccionada = evento.target.parentElement.parentElement;
    const tareaId = tareaSeleccionada.dataset.id;
    //Accedemos a la label que hemos pulsado y le ponemos el contenteditable = true
    if(  nombreElemento === 'label' ){
        const etiquetaSeleccionada = tareaSeleccionada.children[ 0 ].children[ 1 ];
        console.log( etiquetaSeleccionada );
        etiquetaSeleccionada.setAttribute( 'contenteditable', true ); 
        etiquetaSeleccionada.setAttribute( 'style', 'border: 1px solid #000' );
        //Una vez que editamos la etiqueta ponemos evento para que cuando pulsemos la tecla enter deje de ser editable
        etiquetaSeleccionada.addEventListener( 'keypress', ( evento ) => {
            if( evento.key === 'Enter' ){
                //Tenemos que coger el valor que hay dentro de la etiqueta y guardarlo en una constante para modificarlo en el vector
                const textoLabel = etiquetaSeleccionada.innerHTML;
                etiquetaSeleccionada.setAttribute( 'contenteditable', false );
                etiquetaSeleccionada.removeAttribute( 'style' );
                //Tendremos que modificar la tarea que hemos editado usando su id
                listaTareas.listaTareas.forEach( ( tarea ) => {
                    //Lo que hay en el atributo es texto y lo que hay en la clase es un número
                    if( tarea.id == tareaId ){
                        tarea.tarea = textoLabel;
                        //Faltaría actualizar el local Storage
                        listaTareas.guardarLocalStorage();
                    
                    }
                } );
            }
        } )
    } 
})



