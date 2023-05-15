/* CREANDO VARIABLES GLOBALES */
let arrayCatalogo = new Array();
let numPage;
let numLibros = 0;

/* LEER PARÁMETROS URL */
let parametrosURL = new URLSearchParams(location.search);

/* COMPROBAR PÁGINA */
if (parseInt(parametrosURL.get("page")) == 1 || parametrosURL.get("page") == null) {
    numPage = 1;
} else {
    numPage = parametrosURL.get("page") == 1;
}

/* SOLICITAR DATOS AL SERVIDOR */
fetch("json/libros.json").then(respuesta => respuesta.json()).then(objeto => {
    arrayCatalogo = objeto;
    cargarCatalogo(numPage);
})

/* DEFINIR CARGAR CATALOGO */
function cargarCatalogo(pagina) {
    // Referencia de catalogo
    let filaCatalogo = document.querySelector("#catalogo");
    // Crear elementos (el número que multiplica hace referencia a la cantidad de artículos creados)
    let inicio = (pagina - 1) * 12;// formula para encontrar el inicio 
    let final;
    let tmbfinal = pagina * 12;
    // condicional
    if (arrayCatalogo.length < tmbfinal) {
        final = arrayCatalogo.length;
    } else {
        final = tmbfinal;
    }
    for (let index = inicio; index <= final; index++) {
        // Procesando valores producto
        let nombre = arrayCatalogo[index].name;
        let nomImage = arrayCatalogo[index].image;
        // Proceso precios
        let precio = arrayCatalogo[index].price;
        let oferta = arrayCatalogo[index].offer * 100;
        let precioFinal = precio - (precio * oferta / 100);
        // Creo Articulo
        let nuevoElemento = document.createElement("article");
        nuevoElemento.setAttribute("class", "col-xs-12 col-sm-6 col-md-4 col-xl-3");
        nuevoElemento.innerHTML =
            `
        <picture>
        <img class="img-fluid" src="img/${nomImage}" alt="${nombre}">
        </picture>
        <h4>${nombre}</h4>
        <p>
        <span class="precioOriginal">S/ ${precio}</span>
        <span class="precioDescuento">-${oferta}%</span> <br>
        <span class="precioFinal">S/ ${precioFinal}</span>
        </p>
        <button onclick="addCarrito(event)" class="btn btn-warning">
        <i class="bi bi-plus-square"></i> 
        Agregar Carrito 
        </button>
        `;
        // Añadir el nuevo elemento al catalogo
        filaCatalogo.append(nuevoElemento);
    }
}

function addCarrito(event) {
    const button = event.target;
    const article = button.closest('article');
    const nombre = article.querySelector('h4').innerText;
    const precio = article.querySelector('.precioFinal').innerText;
    const imagenSrc = article.querySelector('img').getAttribute('src');

    const nuevoElemento = document.createElement('div');
    nuevoElemento.innerHTML = `
      <p style="font-weight: bold; font-size: 1.5em">${nombre}</p>
      <img src="${imagenSrc}" alt="${nombre}" style="min-height: 300px; max-width: 500px;">
      <p style="font-weight: bold; font-size: 1.5em">${precio}</p>
    `;

    const carritoProductos = document.getElementById('carritoProductos');
    carritoProductos.appendChild(nuevoElemento);

    const ventanaCarrito = new bootstrap.Modal(document.getElementById('ventanaCarrito'));
    ventanaCarrito.show();

    // Actualizar el precio total
    actualizarPrecioTotal(precio);

    // Incrementar el contador de productos
    numLibros++;
    let contadorProductos = document.getElementById("contador-productos");
    contadorProductos.textContent = numLibros;
}

const botonBorrar = document.getElementById('botonBorrar');
botonBorrar.addEventListener('click', vaciarCarrito);

/* METODO PARA ELIMINAR EL PRODUCTO DEL CARRITO Y REINICIANDO DESDE 0 INCLUYENDO AL CONTADOR*/

function vaciarCarrito() {
    let modalCuerpo = document.querySelector("#ventanaCarrito > div > div > div.modal-body");
    modalCuerpo.innerHTML = "<p>Sin ninguna compra.</p>";

    let modalPie = document.querySelector("#ventanaCarrito > div > div > div.modal-footer > div.mb-3");
    // Agregando a la etiqueta "p" el id "total-pagar" para mostrar las actualizaciones de los precios
    modalPie.innerHTML = `<h3>Total: <p id="total-pagar">S/ 00.00</p></h3>`;

    totalPagar = 0; // Reiniciar el valor de totalPagar a 0
    numLibros = 0; // Reiniciar el valor de numLibros a 0

    let contadorProductos = document.querySelector("#contador-productos");
    contadorProductos.textContent = numLibros;
}


/* SE OBTIENE LA REFERENCIA DEL BOTON FINALIZAR DESDE LA ETIQUETA BUTTON DE ID = "botonFinalizar" */
let botonFinalizar = document.querySelector("#botonFinalizar");

/* AGREGAMOS EL EVENTO CLICK Y EJECUTAR MÉTODO "finalizarCompra" */
botonFinalizar.addEventListener("click", finalizarCompra);

/* ESTE MÉTODO NOTIFICA LA COMPRA REALIZADA */
function finalizarCompra() {
    let modalCuerpo = document.querySelector("#ventanaCarrito > div > div > div.modal-body");
    modalCuerpo.innerHTML = "<p>Sin ninguna compra.</p>";

    let modalPie = document.querySelector("#ventanaCarrito > div > div > div.modal-footer > div.mb-3");
    // Agregando a la etiqueta "p" el id "total-pagar" para mostrar las actualizaciones de los precios
    modalPie.innerHTML = `<h3>Total: <p id="total-pagar">S/ 00.00</p></h3>`;

    totalPagar = 0; // Reiniciar el valor de totalPagar a 0
    numLibros = 0; // Reiniciar el valor de numLibros a 0

    let contadorProductos = document.querySelector("#contador-productos");
    contadorProductos.textContent = numLibros;
}

//MÉTODO PARA ACTUALIZAR LOS PRECIOS TOTALES
function actualizarPrecioTotal(precio) {
    const totalPagar = document.getElementById('total-pagar');
    const precioActual = parseFloat(totalPagar.innerText.replace('S/ ', ''));
    const precioNuevo = parseFloat(precio.replace('S/ ', ''));

    const nuevoTotal = precioActual + precioNuevo;
    totalPagar.innerText = 'S/ ' + nuevoTotal.toFixed(2);
}