let products = [];

// Datos de los camiones
const camiones = [
    { nombre: "Camión 1", capacidadVolumen: 60, capacidadPeso: 35000 },
    { nombre: "Camión 2", capacidadVolumen: 70, capacidadPeso: 37000 },
    { nombre: "Camión 3", capacidadVolumen: 80, capacidadPeso: 38000 },
    { nombre: "Camión 4", capacidadVolumen: 90, capacidadPeso: 39000 },
    { nombre: "Camión 5", capacidadVolumen: 100, capacidadPeso: 4000 }
];

document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos del JSON cuando se carga la página
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            products = data;
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
});

function procesarDatos() {
    const input = document.getElementById("pedido").value.trim();
    const lineas = input.split("\n"); // Separar las líneas de texto
    let totalVolumen = 0;
    let totalPeso = 0;

    // Limpiar resultados anteriores
    const tablaResultados = document.getElementById("resultado-individuales");
    const resultadoGrupal = document.getElementById("resultado-grupal");
    const resultadoCamiones = document.getElementById("resultado-camiones");
    tablaResultados.innerHTML = "";
    resultadoGrupal.innerHTML = "";
    resultadoCamiones.innerHTML = "";

    lineas.forEach(linea => {
        const [codigo, cantidad] = linea.split(",").map(item => item.trim()); // Separar código y cantidad
        const producto = products.find(p => p.codigo === codigo);

        if (producto) {
            const volumenPorUnidad = producto.largo * producto.alto * producto.ancho / 1e6; // Convertir a m³
            const pesoPorUnidadKg = producto.peso / 1000; // Convertir a kg
            const cantidadNumerica = parseInt(cantidad, 10);

            const volumenTotal = volumenPorUnidad * cantidadNumerica;
            const pesoTotal = pesoPorUnidadKg * cantidadNumerica;

            totalVolumen += volumenTotal;
            totalPeso += pesoTotal;

            // Agregar fila a la tabla de resultados individuales
            const fila = tablaResultados.insertRow();
            fila.innerHTML = `<td>${codigo}</td>
                <td>${producto.tipo_empaque}</td>
                <td>${producto.largo} x ${producto.alto} x ${producto.ancho}</td>
                <td>${pesoPorUnidadKg.toFixed(2)}</td>
                <td>${volumenPorUnidad.toFixed(6)}</td>
                <td>${cantidadNumerica}</td>
                <td>${volumenTotal.toFixed(2)}</td>
                <td>${pesoTotal.toFixed(2)}</td>`;
        } else {
            const fila = tablaResultados.insertRow();
            fila.innerHTML = `<td colspan="8">Producto con código ${codigo} no encontrado.</td>`;
        }
    });

    // Mostrar resultados grupales
    resultadoGrupal.innerHTML = `<strong>Volumen total:</strong> ${totalVolumen.toFixed(2)} m³<br>
        <strong>Peso total:</strong> ${totalPeso.toFixed(2)} kg`;

    // Análisis por camión
    camiones.forEach(camion => {
        const porcentajeVolumen = (totalVolumen / camion.capacidadVolumen) * 100;
        const porcentajePeso = (totalPeso / camion.capacidadPeso) * 100;

        resultadoCamiones.innerHTML += `<div class="resultado-camion">
            <strong>${camion.nombre}:</strong><br>
            Capacidad Volumen: ${camion.capacidadVolumen} m³, Capacidad Peso: ${camion.capacidadPeso} kg<br>
            Volumen utilizado: ${porcentajeVolumen.toFixed(2)}% (${totalVolumen.toFixed(2)} m³)<br>
            Peso utilizado: ${porcentajePeso.toFixed(2)}% (${totalPeso.toFixed(2)} kg)<br>
            ${porcentajeVolumen > 100 || porcentajePeso > 100 ? "<strong>¡No cabe!</strong><br><br>" : "Cabe en el camión.<br><br>"}
        </div>`;
    });
}
