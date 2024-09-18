// Cargar productos del archivo JSON
let productos = [];

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

    // Limpiar tablas previas
    resultadosIndividuales.innerHTML = '';
    resultadoCamiones.innerHTML = '';

    let volumenTotal = 0;
    let pesoTotal = 0;

    // Procesar cada línea del pedido
    lineas.forEach(linea => {
        const [codigo, cantidadStr] = linea.split(',');
        const cantidad = parseInt(cantidadStr.trim());

        // Buscar el producto en el JSON
        const producto = productos.find(p => p.codigo.trim() === codigo.trim());

        if (producto) {
            // Validar y calcular el volumen de la unidad (en m³)
            const largo_cm = producto.largo_cm || 0;
            const alto_cm = producto.alto_cm || 0;
            const ancho_cm = producto.ancho_cm || 0;
            const volumenUnidad = (largo_cm * alto_cm * ancho_cm) / 1e6; // Convertir cm³ a m³

            // Validar y calcular el peso total de la unidad en gramos
            const pesoUnidadGramos = producto.peso_unidad_empaque || 0;

            // Calcular el volumen total para la cantidad solicitada
            const volumenTotalProducto = volumenUnidad * cantidad;

            // Calcular el peso total para la cantidad solicitada
            const pesoTotalProducto = pesoUnidadGramos * cantidad;

            // Acumular el volumen y el peso totales
            volumenTotal += volumenTotalProducto;
            pesoTotal += pesoTotalProducto;

            // Añadir fila a la tabla de resultados individuales
            const fila = `<tr>
                <td>${producto.codigo}</td>
                <td>${producto.empaque || 'N/A'}</td>
                <td>${largo_cm || 'N/A'}</td>
                <td>${alto_cm || 'N/A'}</td>
                <td>${ancho_cm || 'N/A'}</td>
                <td>${producto.unidad_empaque_gramos || 'N/A'}</td>
                <td>${(pesoUnidadGramos / 1000).toFixed(2)}</td>
                <td>${producto.empaque_canasta || 'N/A'}</td>
                <td>${volumenUnidad.toFixed(6)}</td>
                <td>${cantidad}</td>
                <td>${volumenTotalProducto.toFixed(6)}</td>
                <td>${(pesoTotalProducto / 1000).toFixed(2)}</td> <!-- Convertir gramos a kilogramos -->
            </tr>`;
            resultadosIndividuales.insertAdjacentHTML('beforeend', fila);
        } else {
            // Si no se encuentra el producto, mostrar una fila indicando que no se encontró
            const fila = `<tr>
                <td>${codigo.trim()}</td>
                <td colspan="10">Producto no encontrado</td>
            </tr>`;
            resultadosIndividuales.insertAdjacentHTML('beforeend', fila);
        }
    });

    // Datos de camiones
    const camiones = [
        { nombre: 'Camión Placa 1', capacidadVolumen: 58, capacidadPeso: 3000 },
        { nombre: 'Camión Placa 2', capacidadVolumen: 60, capacidadPeso: 3500 },
        { nombre: 'Camión Placa 3', capacidadVolumen: 57, capacidadPeso: 37000 },
        { nombre: 'Camión Placa 4', capacidadVolumen: 16.7, capacidadPeso: 1200 },
        { nombre: 'Camión Placa 5', capacidadVolumen: 120, capacidadPeso: 7000 }
    ];

    // Analizar cada camión
    camiones.forEach(camion => {
        const volumenUtilizado = (volumenTotal / camion.capacidadVolumen) * 100;
        const pesoUtilizado = (pesoTotal / camion.capacidadPeso) * 100;
        const cabe = (volumenUtilizado <= 100 && pesoUtilizado <= 100) ? 'Sí' : 'No';

        // Añadir fila a la tabla de camiones
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
