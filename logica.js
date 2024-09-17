let products = [];

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
    const tablaResultados = document.getElementById("resultado-individuales").getElementsByTagName('tbody')[0];
    const resultadoGrupal = document.getElementById("resultado-grupal");
    tablaResultados.innerHTML = "";
    resultadoGrupal.innerHTML = "";

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
}
