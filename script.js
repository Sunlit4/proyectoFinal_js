//Declaro los arrays y variables globales
let carrito = [];
let productosJSON = []; 
let lista = document.getElementById('misProductos');

// Creo una class de los productos que se ingresan al carrito
class ProductoCarrito {
    constructor(objetoProd){
        this.id = objetoProd.id;
        this.nombre = objetoProd.nombre;
        this.imagen = objetoProd.imagen;
        this.precio = objetoProd.precio;
        this.categoria = objetoProd.categoria
        this.cantidad = 1;
    }
}

window.onload=()=>{
    document.querySelector("#miFiltro option[value='pordefecto']").setAttribute("selected", true);
    document.querySelector("#miFiltro").onchange=()=>ordernarProductos();
    obtenerJSON ();
}

//Renderizar los productos 
function renderizarProductos() {
    console.log (productosJSON)
    for (const producto of productosJSON) {
        lista.innerHTML+=`<div class="card text-center">
            <img src=${producto.imagen} class="card-img-top" alt="${producto.nombre}>
            <div class="card-body">
                <h3 class="card-title"> Producto: ${producto.nombre} </h3>
                <p class="card-text"> Categoria: ${producto.categoria}</p>
                <p><strong> $ ${producto.precio} </strong></p>
                <button class='btn btn-danger' id='btn${producto.id}'>Agregar al carrito</button>
            </div>    
        </div>`;
    }
    for (const producto of productosJSON) {
        //Genero un evento para los botones de compra 
        document.querySelector (`#btn${producto.id}`).onclick= function(){
            agregarAlCarrito(producto);
        };
    }
};

//Función para ordenar los productos por precio, orden alfabetico y categoria
function ordernarProductos(){
    //Obtener el value del id del HTML
    let ordenar = document.querySelector('#miFiltro').value; 
    // console.log para observar si se esta cumplimiento con la seleccion
    console.log(ordenar) 
    if (ordenar == "menor"){
        productosJSON.sort(function(a, b){
            return a.precio - b.precio
        });
    }else if (ordenar == "mayor"){
        productosJSON.sort(function (a,b){
            return b.precio - a.precio
        });
    }else if (ordenar == "alfabetico"){
        productosJSON.sort(function (a,b){
            return a.nombre.localeCompare (b.nombre);
        });
    }else if (ordenar == "categoria"){
        productosJSON.sort(function (a,b){
            return a.categoria.localeCompare (b.categoria);
        })
    }
    //Luego del reordenamiento tengo que volver a renderizar
    // Incorporo un innerHTML vacio a misProductos para que no se repitan los productos
    document.querySelector("#misProductos").innerHTML="";
    renderizarProductos();
}

//Función agegar el producto al carrito 
function agregarAlCarrito (productoNuevo){
    let encontrado = carrito.find (prod => prod.id == productoNuevo.id);
    console.log (encontrado);
    if (encontrado == undefined){ 
        // si el producto no se encuentra en el carrito, se agrega productoNuevo
        let prodCarrito = new ProductoCarrito(productoNuevo);
        carrito.push (prodCarrito);
        console.log(carrito);
        Swal.fire(
            'Producto agregado a tu carrito',
            productoNuevo.nombre,
            'success'
        );
        // por DOM creo una fila en la tabla del carrito
        document.querySelector("#tablaBody").innerHTML +=(`
            <tr id='fila${prodCarrito.id}'>
                <td>${prodCarrito.nombre}</td>
                <td>${prodCarrito.categoria}</td>
                <td id='${prodCarrito.id}'>${prodCarrito.cantidad}</td>
                <td>${prodCarrito.precio}</td>
                <td>
                    <button onclick='eliminar(${prodCarrito.id})'>
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`);
    }else {
        //Si el producto se encuentra, pido al carrito el lugar del producto y suma la cantidad
        let lugar = carrito.findIndex (prod => prod.id == productoNuevo.id);
        console.log (lugar);
        carrito[lugar].cantidad += 1;
        document.getElementById(productoNuevo.id).innerHTML=carrito[lugar].cantidad;
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Se agregro nuevamente este producto',
            text: productoNuevo.nombre,
            showConfirmButton: false,
            timer: 1500 
        })
    }
    // Se crea por DOM el footer del carrito si es mayor a 0 
    carrito.length > 0 ?(
        document.querySelector('#seccionTotal').innerHTML=(`
            <p id="totalCarrito">Total: $ ${calcularTotal()}</p>
            <button id="clearCarrito" class="botonesCarrito">Vaciar Carrito</button>
            <button id="finalizar" class="botonesCarrito">Finalizar compra</button> `)
    ): (null);
    //Genero un evento para los btn finalizar y vaciar 
    document.querySelector('#clearCarrito').addEventListener('click', vaciarCarrito);
    document.querySelector('#finalizar').addEventListener('click', finalizar);
}


//Funcion para  eliminar un item 
function eliminar(id){ 
    let item =carrito.findIndex(prod => prod.id==id);
    carrito.splice(item,1);
    let fila=document.getElementById(`fila${id}`);
    document.getElementById("tablaBody").removeChild(fila);
    document.querySelector("#seccionTotal").innerText=(`Total: $ ${calcularTotal()}`);
}  


//Calcular el total del carrito 
function calcularTotal () {
    let total = 0
    for (const articulo of carrito){
        total = total + (articulo.precio * articulo.cantidad);
    }
    return total; 
}

//Vaciar el carrito 
function vaciarCarrito (){
    document.getElementById('tablaBody').innerHTML = '';
    document.getElementById('totalCarrito').innerHTML = (`Total: $0`);
    carrito = []
}

//Finalizar compra
function finalizar(){
    if (carrito.length == 0){
        Swal.fire({
            icon: 'error',
            title: 'No hay ningun item en tu carrito',
            text: 'Agrega unproducto para continuar',
            confirmButtonColor: "#444444"
          })
    }else{
        Swal.fire({
        title: '¿Seguro que queres finalizar tu compra?',
        text: `Total a abonar: $${calcularTotal()}`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Compra confirmada.¡Que lo disfrutes!',
            'Muchas gracias por tu compra.',
            'success'
        )
        vaciarCarrito();
    }
    })
}    
}

//-------------------Formulario de sección Contacto-------------------
//Si el usuario quiere enviar un mensaje, completa los datos solicitados 

let nombre = document.getElementById('name');
let email = document.getElementById('email');
let mensaje = document.getElementById ('mensaje');

let formulario=document.getElementById("formulario");
let enviarFormulario = (event)=>{
    //cancelo el compartimiento del evento
    event.preventDefault (); 
    //DESTRUCTURACIÓN - Capturo el comportamiento de los elementos e imprimo los valores del input
    let {name, email, mensaje} = event.target
    console.log ( 
        name.value, 
        email.value,
        mensaje.value
    );
    //Si el usuario no ingresa nada en algunos de los inputs por DOM se imprime la siguiente leyenda
    //OPERADOR TERNARIO
    (nombre.value=="" || email.value=="" || mensaje.value=="" || !isNaN(nombre.value)) 
    ? Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Para enviar el mensaje ingrese los datos correspondientes',}) 
    : Swal.fire(
        'Mensaje enviado',
        'Nos comunicaremos a la brevedad'
    )
}
formulario.addEventListener("submit",enviarFormulario);

//GETJSON de productos.json
async function obtenerJSON (){
    const resp=await fetch("./data/productos.json")
    const data=await resp.json()
    productosJSON = data;
    renderizarProductos()
}
