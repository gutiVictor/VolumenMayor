// Cargar productos del archivo JSON
let productos = [];

/* funcion para exportar a excel */
function exportarExcel() {
  /* Obtener la tabla de resultados individuales */
  var tablaResultados = document.getElementById("resultados");

  // Crear un nuevo libro de Excel
  var wb = XLSX.utils.book_new();

  // Agregar la tabla de resultados individuales como una hoja de Excel
  var ws = XLSX.utils.table_to_sheet(tablaResultados);

  // Añadir la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, "Resultados");

  // Obtener los valores de los resultados totales
  var volumenTotal = document.getElementById("volumen-total").parentElement.style.display = "none";
  var volumenTotalCanastilla = document.getElementById("volumen-total-canastilla").parentElement.style.display = "none";

  var diferenciaVolumen =
  document.getElementById("diferencia-volumen").parentElement.style.display = "none"; // Ocultar la celda

  var pesoTotal = document.getElementById("peso-total").innerText;

  //
  var volumenTotalBolsa = document.getElementById("volumen-total-bolsa").innerText;
  var volumenTotalCajas = document.getElementById("volumen-total-cajas").innerText;
  var volumenConsolidadoCajasBolsas = document.getElementById("volumen-consolidado-cajas-bolsas").innerText;

  // Agregar los resultados totales a la hoja de Excel, justo después de los datos de la tabla
  var range = XLSX.utils.decode_range(ws["!ref"]);
  var rowStart = range.e.r + 2; // Una fila vacía entre la tabla y los resultados totales

  // Añadir las filas de los resultados totales
  XLSX.utils.sheet_add_aoa(
    ws,
    [
      ["Resultados Totales:"],
     /*  ["Volumen Total (m³):", volumenTotal],
      ["Volumen Total Canastilla (m³):", volumenTotalCanastilla],
      ["Diferencia de Volumen (m³):", diferenciaVolumen], */
      ["Peso Total (kg):", pesoTotal],
      ["Volumen Total Bolsa (m³):",volumenTotalBolsa],
      ["Volumen Total Cajas (m³):", volumenTotalCajas],
      ["Consolidado de Volumen  cajas + bolsas (m³):",volumenConsolidadoCajasBolsas ],
    ],
    { origin: "A" + rowStart }
  );

  // Exportar el archivo como Excel
  XLSX.writeFile(wb, "resultados_fenix.xlsx");
}

// Función para recargar la página
function reiniciar() {
  location.reload(); // Recarga la página actual
}

fetch("productos.json")
  .then((response) => response.json())
  .then((data) => (productos = data))
  .catch((error) => console.error("Error cargando productos:", error));

// Función para procesar los datos ingresados
function procesarDatos() {
  const pedidoTexto = document.getElementById("pedido").value;
  const lineas = pedidoTexto.split("\n");
  const resultadosIndividuales = document.getElementById(
    "resultado-individuales"
  );
  const resultadoCamiones = document.getElementById("resultado-camiones");
  const volumenTotalElem = document.getElementById("volumen-total");
  const pesoTotalElem = document.getElementById("peso-total");
  const volumenCanastillaElem = document.getElementById(
    "volumen-total-canastilla"
  );
  const diferenciaVolumenElem = document.getElementById("diferencia-volumen");

  /* creamos la constante paar <th>F. Arrume</th> */
  const arrume = document.getElementById("arrume");

  // Limpiar tablas previas
  resultadosIndividuales.innerHTML = "";
  resultadoCamiones.innerHTML = "";
  volumenTotalElem.textContent = "";
  pesoTotalElem.textContent = "";
  volumenCanastillaElem.textContent = "";
  diferenciaVolumenElem.textContent = "";
  /* creamos campo para limpiar <th>F. Arrume</th> */

  let volumenTotal = 0;
  let pesoTotal = 0;
  let totalCanastilla = 0;
  let volumenTotalBolsa = 0;
  let volumenTotalCajas = 0;

  // Constante para volumen de la canastilla en m³
  const VOLUMEN_CANASTA = 2.89;

  // Procesar cada línea del pedido
  lineas.forEach((linea) => {
    let datos = linea.includes("\t")
      ? linea.split("\t")
      : linea.split(/[\s,]+/);

    if (datos.length >= 2) {
      let codigo = datos[0].trim().toUpperCase();
      let cantidadStr = datos[1].trim();
      const cantidad = parseInt(cantidadStr);
      const producto = productos.find((p) => p.codigo.trim() === codigo.trim());

      if (producto) {
        const largo_m = producto.largo_m || 0;
        const alto_m = producto.alto_m || 0;
        const ancho_m = producto.ancho_m || 0;
        const volumenUnidad = largo_m * alto_m * ancho_m;
        const pesoUnidadGramos = producto.peso_unidad_empaque || 0;
        const volumenTotalProducto = volumenUnidad * cantidad;
        const pesoTotalProducto = pesoUnidadGramos * cantidad;

        // Calcular el consolidado de volumen de cajas + bolsas
const volumenConsolidadoCajasBolsas = volumenTotalBolsa + volumenTotalCajas;

        volumenTotal += volumenTotalProducto;
        pesoTotal += pesoTotalProducto;

        // Calcular volumen de la canastilla
        const volumenCanastillaUnidad =
          VOLUMEN_CANASTA / producto.empaque_canasta;
        const volumenTotalCanastilla = volumenCanastillaUnidad * cantidad;

        /* crear constante para cubicaje bolsa */
        const cubicajeBolsa =
          producto.tipo === "Bolsa"
            ? parseFloat(volumenTotalCanastilla.toFixed(6))
            : 0;

        /* crear constante para cubicaje caja */
        const cubicajeCaja =
          producto.tipo === "Caja"
            ? parseFloat(volumenTotalProducto.toFixed(6))
            : 0;

        volumenTotalBolsa += cubicajeBolsa;
        volumenTotalCajas += cubicajeCaja;
        totalCanastilla += volumenTotalCanastilla;

        /* crear constante para cubicaje total de la suma de bolsa y caja */
        const cubicajeTotal = (
          parseFloat(cubicajeBolsa) + parseFloat(cubicajeCaja)
        ).toFixed(6); //(cubicajeBolsa + cubicajeCaja).toFixed(6); // cubicajeBolsa + cubicajeCaja;

        totalCanastilla += volumenTotalCanastilla;

        // Añadir fila a la tabla de resultados individuales
        const fila = `<tr>
                    <td>${producto.codigo}</td>
                    <td>${producto.empaque || "N/A"}</td>
                    <td>${producto.unidad_empaque_gramos || "N/A"}</td>
                    <td>${(pesoUnidadGramos / 1000).toFixed(4)}</td>
                    <td>${producto.empaque_canasta || "N/A"}</td>
                    <td>${volumenUnidad.toFixed(6)}</td>
                    <td>${volumenCanastillaUnidad.toFixed(6)}</td>
                    <td>${cantidad}</td>
                    <td>${volumenTotalProducto.toFixed(6)}</td> 
                     <td>${volumenTotalCanastilla.toFixed(
                       6
                     )}</td>                 
                    <td>${(pesoTotalProducto / 1000).toFixed(2)}</td>


                    <td>${cubicajeBolsa}</td>                   
                    <td>${cubicajeCaja}</td>

                  


                     

                   
                </tr>`;

        resultadosIndividuales.insertAdjacentHTML("beforeend", fila);
      } else {
        const fila = `<tr>
                    <td>${codigo.trim()}</td>
                    <td colspan="10">Producto no encontrado</td>
                </tr>`;
        resultadosIndividuales.insertAdjacentHTML("beforeend", fila);
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

  // Mostrar los nuevos campos de bolsas y cajas
  document.getElementById("volumen-total-bolsa").textContent =
    volumenTotalBolsa.toFixed(6);
  document.getElementById("volumen-total-cajas").textContent =
    volumenTotalCajas.toFixed(6);


    const volumenConsolidadoCajasBolsas = volumenTotalBolsa + volumenTotalCajas;
    document.getElementById("volumen-consolidado-cajas-bolsas").textContent = volumenConsolidadoCajasBolsas.toFixed(6);
    console.log("volumenConsolidadoCajasBolsas", volumenConsolidadoCajasBolsas);
  // Datos de camiones
  const camiones = [
    {
      nombre: "Camión Placa WDL-969",
      capacidadVolumen: 16.75,
      capacidadPeso: 2100,
    },
    {
      nombre: "Camión Placa SQD-655",
      capacidadVolumen: 57.61,
      capacidadPeso: 7000,
    },
    {
      nombre: "Camión Placa SQD-563",
      capacidadVolumen: 57.88,
      capacidadPeso: 7000,
    },
    {
      nombre: "Camión Placa WCW-366",
      capacidadVolumen: 60.68,
      capacidadPeso: 6900,
    },
    {
      nombre: "Camión Placa TJB-056",
      capacidadVolumen: 58.73,
      capacidadPeso: 7000,
    },
    {
      nombre: "Camión Placa SZR-699",
      capacidadVolumen: 75.25,
      capacidadPeso: 24000,
    },
    {
      nombre: "Camión Placa SZR-652",
      capacidadVolumen: 75.25,
      capacidadPeso: 24000,
    },
    { nombre: "Contenedor 40",
       capacidadVolumen: 67.7,
        capacidadPeso: 30480, },
    { nombre: "Contenedor 20", 
      capacidadVolumen: 33.2,
       capacidadPeso:  24000, },
  ];

  camiones.forEach((camion) => {
    const volumenUtilizado = (volumenTotal / camion.capacidadVolumen) * 100;
    const pesoUtilizado = (pesoTotal / 1000 / camion.capacidadPeso) * 100;
    const volumenMetros = camion.capacidadVolumen - totalCanastilla; // Volumen en metros cúbicos

    const cabe = volumenUtilizado <= 100 && pesoUtilizado <= 100 ? "Sí" : "No";

    // Crear la fila sin el contenido de las celdas de volumen y peso
    const filaCamion = document.createElement("tr");

    // Crear las celdas para el nombre, capacidadVolumen y capacidadPeso
    const nombreTd = document.createElement("td");
    nombreTd.textContent = camion.nombre;

    const capacidadVolumenTd = document.createElement("td");
    capacidadVolumenTd.textContent = camion.capacidadVolumen;

    const capacidadPesoTd = document.createElement("td");
    capacidadPesoTd.textContent = camion.capacidadPeso;

    // Crear la celda de volumen y agregar clase si se excede el 100%
    const volumenTd = document.createElement("td");
    volumenTd.textContent = `${volumenUtilizado.toFixed(2)}%`;
    if (volumenUtilizado > 100) {
      volumenTd.classList.add("rojo"); // Agregar clase 'rojo' si volumen excede 100%
    }

    // Crear la celda de peso y agregar clase si se excede el 100%
    const pesoTd = document.createElement("td");
    pesoTd.textContent = `${pesoUtilizado.toFixed(2)}%`;
    if (pesoUtilizado >= 100) {
      pesoTd.classList.add("rojo"); // Agregar clase 'rojo' si peso excede 100%
    }

    // Crear la celda de volumen en metros
    const volumenMetrosTd = document.createElement("td");
    volumenMetrosTd.textContent = `${volumenMetros.toFixed(2)}m³`;


    // Crear la celda de volumen consolidado
    const volumenConsolidadoCajasBolsasTd = document.createElement("td");
    volumenConsolidadoCajasBolsasTd.textContent = `${(volumenConsolidadoCajasBolsas).toFixed(2)}m³`;

    // Crear la celda para si cabe o no
    const cabeTd = document.createElement("td");
    cabeTd.textContent = cabe;


     /* cambaiar por el nombre que se necesita real  comparacion camion.capacidadVolumen - volumenConsolidadoCajasBolsas */
  const cubicajeTotalCB = camion.capacidadVolumen - volumenConsolidadoCajasBolsas;
  
    // Crear la celda para el cubicaje total
    const cubicajeTotalCBTd = document.createElement("td");
    cubicajeTotalCBTd.textContent = `${cubicajeTotalCB.toFixed(2)}m³`;
   
    // Añadir las celdas a la fila
    filaCamion.appendChild(nombreTd);
    filaCamion.appendChild(capacidadVolumenTd);
    filaCamion.appendChild(capacidadPesoTd);
    filaCamion.appendChild(volumenTd);
    filaCamion.appendChild(pesoTd);
    filaCamion.appendChild(volumenMetrosTd);
    filaCamion.appendChild(cabeTd);
    filaCamion.appendChild(cubicajeTotalCBTd);

  

    console.log("este es el que se necesita: ",cubicajeTotalCB);

   


    // Añadir la fila al resultado
    resultadoCamiones.appendChild(filaCamion);
  });
}
