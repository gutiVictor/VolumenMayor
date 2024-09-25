// Cargar productos del archivo JSON
let productos = [];

 // Función para recargar la página
 function reiniciar() {
    location.reload(); // Recarga la página actual
}

fetch('productos.json')
    .then(response => response.json())
    .then(data => productos = data)
    .catch(error => console.error('Error cargando productos:', error));




// Función para procesar los datos ingresados
function procesarDatos() {
    const pedidoTexto = document.getElementById('pedido').value;
    const lineas = pedidoTexto.split('\n');
    const resultadosIndividuales = document.getElementById('resultado-individuales');
    const resultadoCamiones = document.getElementById('resultado-camiones');
    const volumenTotalElem = document.getElementById('volumen-total');
    const pesoTotalElem = document.getElementById('peso-total');
    const volumenCanastillaElem = document.getElementById('volumen-total-canastilla');
    const diferenciaVolumenElem = document.getElementById('diferencia-volumen');

    // Limpiar tablas previas
    resultadosIndividuales.innerHTML = '';
    resultadoCamiones.innerHTML = '';
    volumenTotalElem.textContent = '';
    pesoTotalElem.textContent = '';
    volumenCanastillaElem.textContent = '';
    diferenciaVolumenElem.textContent = '';

    let volumenTotal = 0;
    let pesoTotal = 0;
    let totalCanastilla = 0;

    // Constante para volumen de la canastilla en m³
    const VOLUMEN_CANASTA = 2.80;

    // Procesar cada línea del pedido
    lineas.forEach(linea => {
        let datos = linea.includes('\t') ? linea.split('\t') : linea.split(/[\s,]+/);

        if (datos.length >= 2) {
            let codigo = datos[0].trim().toUpperCase();
            let cantidadStr = datos[1].trim();
            const cantidad = parseInt(cantidadStr);
            const producto = productos.find(p => p.codigo.trim() === codigo.trim());

            if (producto) {
                const largo_m = (producto.largo_m || 0);
                const alto_m = (producto.alto_m || 0);
                const ancho_m = (producto.ancho_m || 0);
                const volumenUnidad = largo_m * alto_m * ancho_m;
                const pesoUnidadGramos = producto.peso_unidad_empaque || 0;
                const volumenTotalProducto = volumenUnidad * cantidad;
                const pesoTotalProducto = pesoUnidadGramos * cantidad;

                volumenTotal += volumenTotalProducto;
                pesoTotal += pesoTotalProducto;

                // Calcular volumen de la canastilla
                const volumenCanastillaUnidad = VOLUMEN_CANASTA / producto.empaque_canasta;
                const volumenTotalCanastilla = volumenCanastillaUnidad * cantidad;
                totalCanastilla += volumenTotalCanastilla;

                // Añadir fila a la tabla de resultados individuales
                const fila = `<tr>
                    <td>${producto.codigo}</td>
                    <td>${producto.empaque || 'N/A'}</td>
                    <td>${producto.unidad_empaque_gramos || 'N/A'}</td>
                    <td>${(pesoUnidadGramos / 1000).toFixed(4)}</td>
                    <td>${producto.empaque_canasta || 'N/A'}</td>
                    <td>${volumenUnidad.toFixed(6)}</td>
                    <td>${cantidad}</td>
                    <td>${volumenTotalProducto.toFixed(6)}</td>
                    <td>${(pesoTotalProducto / 1000).toFixed(2)}</td>
                    <td>${volumenCanastillaUnidad.toFixed(6)}</td>
                </tr>`;
                resultadosIndividuales.insertAdjacentHTML('beforeend', fila);
            } else {
                const fila = `<tr>
                    <td>${codigo.trim()}</td>
                    <td colspan="10">Producto no encontrado</td>
                </tr>`;
                resultadosIndividuales.insertAdjacentHTML('beforeend', fila);
            }
        }
    });

    // Calcular la diferencia de volumen
    const diferenciaVolumen = totalCanastilla - volumenTotal;

    // Mostrar los totales en el HTML
    volumenTotalElem.textContent = volumenTotal.toFixed(6);
    pesoTotalElem.textContent = (pesoTotal / 1000).toFixed(2); // Convertir a kg
    volumenCanastillaElem.textContent = totalCanastilla.toFixed(6);
    diferenciaVolumenElem.textContent = diferenciaVolumen.toFixed(6);

    // Datos de camiones
    const camiones = [
        { nombre: 'Camión Placa WDL-969', capacidadVolumen: 16.75, capacidadPeso: 2100 },
        { nombre: 'Camión Placa SQD-655', capacidadVolumen: 57.61, capacidadPeso: 7000 },
        { nombre: 'Camión Placa SQD-563', capacidadVolumen: 57.88, capacidadPeso: 7000 },
        { nombre: 'Camión Placa WCW-366', capacidadVolumen: 60.68, capacidadPeso: 6900 },
        { nombre: 'Camión Placa TJB-056', capacidadVolumen: 58.73, capacidadPeso: 7000 },
        { nombre: 'Camión Placa SZR-699', capacidadVolumen: 75.25, capacidadPeso: 24000 },
        { nombre: 'Camión Placa SZR-652', capacidadVolumen: 75.25, capacidadPeso: 24000 }
    ];

    camiones.forEach(camion => {
        const volumenUtilizado = (volumenTotal / camion.capacidadVolumen) * 100;
        const pesoUtilizado = ((pesoTotal / 1000) / camion.capacidadPeso) * 100;
        const cabe = (volumenUtilizado <= 100 && pesoUtilizado <= 100) ? 'Sí' : 'No';

        const filaCamion = `<tr>
            <td>${camion.nombre}</td>
            <td>${camion.capacidadVolumen}</td>
            <td>${camion.capacidadPeso}</td>
            <td>${volumenUtilizado.toFixed(2)}%</td>
            <td>${pesoUtilizado.toFixed(2)}%</td>
            <td>${cabe}</td>
        </tr>`;
        resultadoCamiones.insertAdjacentHTML('beforeend', filaCamion);
    });
}

