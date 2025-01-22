// Constants *********************************************************************************
document.title = "Deposit Approval Predictor"; // Title module / Módulo de título

// Select button elements
const boton = document.getElementById("submitForm"); // Spanish: Seleccionar el botón
const submitButton = document.getElementById("submitForm"); // Spanish: Botón de envío
const loadingButton = document.getElementById("submitLoading"); // Spanish: Botón de carga

// Events when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Spanish: Eventos al cargar la página
  const monthField = document.getElementById("month"); // Spanish: Campo de mes
  const dayField = document.getElementById("day"); // Spanish: Campo de día
  const dayLabel = document.getElementById("labelDay"); // Spanish: Etiqueta de día

  // Days in each month
  const daysInMonth = {
    // Spanish: Días de cada mes
    jan: 31, // January / Enero
    feb: 28, // February / Febrero, manual adjustment for leap years if needed / ajuste manual para años bisiestos si es necesario
    mar: 31, // March / Marzo
    apr: 30, // April / Abril
    may: 31, // May / Mayo
    jun: 30, // June / Junio
    jul: 31, // July / Julio
    aug: 31, // August / Agosto
    sep: 30, // September / Septiembre
    oct: 31, // October / Octubre
    nov: 30, // November / Noviembre
    dec: 31, // December / Diciembre
  };

  // Change event for month field
  monthField.addEventListener("change", function () {
    // Spanish: Evento de cambio para el campo de mes
    const selectedMonth = monthField.value; // Spanish: Mes seleccionado
    const maxDays = daysInMonth[selectedMonth] || 31; // Default to 31 if not selected / Predeterminado a 31 si no se selecciona
    dayField.max = maxDays; // Update the maximum days for the day field / Actualiza el número máximo de días en el campo de día

    // If the current day exceeds the max, adjust it automatically
    if (parseInt(dayField.value) > maxDays) {
      // Spanish: Si el día actual excede el máximo, ajustarlo automáticamente
      dayField.value = maxDays;
      dayLabel.textContent = maxDays;
    }
  });

  // Input event for day field
  dayField.addEventListener("input", function () {
    // Spanish: Evento de entrada para el campo de día
    dayLabel.textContent = dayField.value; // Update day label / Actualizar la etiqueta de día
  });
});

document.addEventListener("DOMContentLoaded", function() {
  // Seleccionar todos los elementos con el atributo 'data-toggle="tooltip"'
  const tooltipElements = document.querySelectorAll('[data-toggle="tooltip"]');

  // Inicializar los tooltips de Bootstrap en cada elemento
  tooltipElements.forEach(function(element) {
    new bootstrap.Tooltip(element);
  });
});


// Submit form event ***********************************************************************************
document.getElementById("submitForm").addEventListener("click", (event) => {
  // Spanish: Evento de envío del formulario
  submitForm();
});
document.getElementById("submitFlex").addEventListener("click", (event) => {
  // Spanish: Evento de envío del formulario
  submitForm();
});

// Fill form fields event / Evento para llenar campos del formulario
document.getElementById("llenarCampos").addEventListener("click", (event) => {
  // Spanish: Evento para llenar los campos
  fillFormFields(); // Spanish: Llenar los campos del formulario
});

// Generic function to update any label / Función genérica para actualizar cualquier etiqueta
const updateLabel = (rangeId, labelId) => {
  document.getElementById(labelId).textContent =
    document.getElementById(rangeId).value; // Actualiza el texto de la etiqueta
};

// Age changes event / Evento para cambios en edad
document
  .getElementById("age")
  .addEventListener("input", () => updateLabel("age", "labelAge"));

// Day changes event / Evento para cambios en el día
document
  .getElementById("day")
  .addEventListener("input", () => updateLabel("day", "labelDay"));

// Init tooltip / Inicializar tooltip
document.addEventListener("DOMContentLoaded", function () {
  // Spanish: Inicialización de tooltip
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl); // Spanish: Crear tooltips
  });
});

// Fill form fields with default values / Rellenar los campos con valores predeterminados
const fillFormFields = () => {
  document.getElementById("job").value = "technician";
  document.getElementById("marital").value = "married";
  document.getElementById("education").value = "tertiary";
  document.getElementById("default").value = "no";
  document.getElementById("housing").value = "yes";
  document.getElementById("loan").value = "no";
  document.getElementById("contact").value = "cellular";
  document.getElementById("month").value = "mar";
  document.getElementById("poutcome").value = "success";

  // Input fields / Campos de entrada
  document.getElementById("balance").value = "1500";
  document.getElementById("day").value = "22";
  document.getElementById("age").value = "45";
  document.getElementById("duration").value = "30";
  document.getElementById("campaign").value = "10";
  document.getElementById("pdays").value = "5";
  document.getElementById("previous").value = "1";

  // Update labels / Actualizar las etiquetas
  updateLabel("age", "labelAge");
  updateLabel("day", "labelDay");
};

// Fetch modal when needed / Cargar el modal cuando sea necesario
const getModal = () => {
  fetch("modal.html") // Spanish: Cargar archivo del modal
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("modal-container").innerHTML = data; // Insert content in container / Insertar contenido en el contenedor
    })
    .catch((error) => console.error("Error cargando el modal:", error));
};

// Create probability pie chart function / Función para crear gráfico de probabilidad
const createFixedProbabilityPieChart = (probYes, probNo) => {
  const canvas = document.getElementById("probabilityPieChart"); // Canvas element / Elemento canvas

  if (!canvas) {
    console.error('No se encontró el canvas con el id "probabilityPieChart"'); // Canvas not found / Canvas no encontrado
    return;
  }

  // Destroy previous chart if exists / Destruir gráfico anterior si existe
  if (
    window.probabilityPieChart &&
    window.probabilityPieChart instanceof Chart
  ) {
    window.probabilityPieChart.destroy();
    canvas.width = canvas.width; // Clean canvas / Limpiar canvas
  }

  // Calculate percentages / Calcular porcentajes
  const probYesPercentage = (probYes * 100).toFixed(2);
  const probNoPercentage = (probNo * 100).toFixed(2);

  let labelYes = `Yes (${probYesPercentage}%)`; // Spanish: Sí
  let labelNo = `No (${probNoPercentage}%)`; // Spanish: No

  const ctx = canvas.getContext("2d"); // Context for drawing / Contexto para dibujar
  const gradientYes = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradientYes.addColorStop(0, "#4A90E2"); // Blue gradient / Gradiente azul
  gradientYes.addColorStop(1, "#81C8FA");

  const gradientNo = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradientNo.addColorStop(0, "#E57373"); // Red gradient / Gradiente rojo
  gradientNo.addColorStop(1, "#FF9A9A");

  window.probabilityPieChart = new Chart(canvas, {
    // Create the pie chart / Crear gráfico circular
    type: "doughnut",
    data: {
      labels: [labelYes, labelNo],
      datasets: [
        {
          label: "Probabilidad",
          data: [probYes * 100, probNo * 100],
          backgroundColor: [gradientYes, gradientNo],
          borderColor: ["#1E88E5", "#E53935"],
          borderWidth: [3, 1],
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 10, bottom: 10 } },
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            font: { family: "Poppins, sans-serif", size: 14 },
            color: "#333",
          },
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const dataLabel = tooltipItem.label || "";
              const value = tooltipItem.raw;
              return `${dataLabel}: ${value.toFixed(2)}%`;
            },
            footer: function () {
              return "Probabilidades totales: 100%";
            },
          },
          bodyFont: { family: "Poppins, sans-serif", size: 12 },
        },
      },
      animation: {
        duration: 1500,
        easing: "easeOutBounce",
      },
    },
  });

  // Accessibility / Accesibilidad
  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    "Gráfico circular mostrando probabilidades de Yes y No"
  );
};

let featureImportanceChartInstance = null;

// Función para configurar el gráfico de importancia de características / Function to configure feature importance graph
const createFeatureImportanceChart = (data) => {
  // Si existe un gráfico previamente, destrúyelo
  if (featureImportanceChartInstance) {
    featureImportanceChartInstance.destroy();
  }

  // Extraer las etiquetas y los datos de la respuesta JSON
  const labels = data["Importancia de características para gráfico"].labels;
  const chartData = data["Importancia de características para gráfico"].data;

  // Combinar las etiquetas y los datos en un solo array de objetos
  const combinedData = labels.map((label, index) => ({
    label,
    value: chartData[index],
  }));

  // Ordenar el array combinado por el valor de mayor a menor
  combinedData.sort((a, b) => b.value - a.value);

  // Extraer las etiquetas y los datos ordenados
  const sortedLabels = combinedData.map((item) => item.label);
  const sortedData = combinedData.map((item) => item.value);

  // Configurar el gráfico
  const ctx = document
    .getElementById("featureImportanceChart")
    .getContext("2d");

  // Crear un nuevo gráfico y almacenarlo en la variable featureImportanceChartInstance
  featureImportanceChartInstance = new Chart(ctx, {
    type: "bar", // Tipo de gráfico (barra)
    data: {
      labels: sortedLabels, // Características ordenadas
      datasets: [
        {
          label: "Importancia de las Características",
          data: sortedData, // Importancia de las características ordenada
          backgroundColor: "rgba(75, 192, 192, 0.2)", // Color de las barras
          borderColor: "rgba(75, 192, 192, 1)", // Color del borde
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true, // Hacer que el gráfico sea responsive
      maintainAspectRatio: false, // Mantener la proporción de tamaño
      scales: {
        x: {
          ticks: {
            font: {
              size: 10, // Tamaño de fuente más pequeño para etiquetas en el eje X
            },
            maxRotation: 45, // Rotar las etiquetas del eje X para que no se solapen
            minRotation: 0,
          },
        },
        y: {
          beginAtZero: true, // Comenzar el eje Y en cero
          ticks: {
            font: {
              size: 12, // Tamaño de fuente de los valores en el eje Y
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false, // Ocultar la leyenda para optimizar espacio en pantallas pequeñas
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.raw.toFixed(2); // Mostrar los valores con 2 decimales
            },
          },
        },
      },
    },
  });
};

// Show chart function / Función para mostrar gráfico
function showChart() {
  document.getElementById("probGrafDiv").classList.remove("d-none");
  document.getElementById("probGrafDiv").classList.add("show");
}

//submit form / enviar formulario
const submitForm = () => {
  // Array of fields to check
  const fields = [
    { id: "job", label: "Job" }, // Spanish: Trabajo
    { id: "marital", label: "Marital Status" }, // Spanish: Estado civil
    { id: "education", label: "Education" }, // Spanish: Educación
    { id: "default", label: "Default Status" }, // Spanish: Estado por defecto
    { id: "balance", label: "Balance" }, // Spanish: Balance
    { id: "housing", label: "Housing" }, // Spanish: Vivienda
    { id: "loan", label: "Loan" }, // Spanish: Préstamo
    { id: "contact", label: "Contact" }, // Spanish: Contacto
    { id: "age", label: "Age" }, // Spanish: Edad
    { id: "day", label: "Day" }, // Spanish: Día
    { id: "month", label: "Month" }, // Spanish: Mes
    { id: "duration", label: "Duration" }, // Spanish: Duración
    { id: "campaign", label: "Campaign" }, // Spanish: Campaña
    { id: "pdays", label: "Pdays" }, // Spanish: Pdays
    { id: "previous", label: "Previous" }, // Spanish: Anterior
    { id: "poutcome", label: "Poutcome" }, // Spanish: Resultado de la campaña anterior
  ];

  let missingFields = fields
    .filter((field) => !document.getElementById(field.id).value)
    .map((field) => field.label); // Spanish: Filtra los campos vacíos

  // Check if there are missing fields / Verificar si faltan campos
  if (missingFields.length > 0) {
    // Spanish: Si faltan campos
    // Show SweetAlert with missing fields
    Swal.fire({
      icon: "info",
      title: "Incomplete Fields", // Spanish: Campos incompletos
      text: "Please complete the following fields: " + missingFields.join(", "), // Spanish: Por favor complete los siguientes campos
    });
  } else {
    // If all fields are completed, proceed with processing / Si todos los campos están completos, continuar con el procesamiento
    const formData = fields.reduce((data, field) => {
      // Spanish: Recopilar datos del formulario
      data[field.label] = document.getElementById(field.id).value;
      return data;
    }, {});

    // Hide the spinner after receiving the response / Ocultar el spinner después de recibir la respuesta
    document.querySelector(".spinner-grow").classList.remove("d-none"); // Remove spinner visibility
    loadingButton.classList.add("d-none"); // Hide the loading button / Ocultar el botón de carga
    submitButton.classList.remove("d-none"); // Show the submit button / Mostrar el botón de envío

    // Send the form data to the backend using fetch
    fetch("/DepositApprovalPredictor", {
      // Spanish: Enviar datos del formulario al backend usando fetch
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Spanish: Tipo de contenido JSON
      },
      body: JSON.stringify(formData), // Convert form data to JSON / Convertir los datos del formulario a JSON
    })
      .then((response) => response.json()) // Parse JSON response / Analizar la respuesta en JSON
      .then((data) => {
        showChart(); // Display chart / Mostrar gráfico

        const probNo = data["Probabilidad de predicción"]["no"]; // Spanish: Probabilidad de "No"
        const probYes = data["Probabilidad de predicción"]["yes"]; // Spanish: Probabilidad de "Sí"

        createFixedProbabilityPieChart(probYes, probNo); // Create chart with data / Crear gráfico con los datos
        createFeatureImportanceChart(data);
        updateMetadataFields(data);
        // Scroll to form section smoothly / Desplazar el contenido hacia el formulario suavemente
        document.getElementById("llenarCampos").scrollIntoView({
          behavior: "smooth", // Smooth scroll effect / Efecto de desplazamiento suave
          block: "start", // Align to top of the page / Alineación en la parte superior
        });
      })
      .catch((error) => {
        // Spanish: Manejar errores
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Submission Error", // Spanish: Error en el envío
          text: "There was an error submitting your form. Please try again.", // Spanish: Hubo un error enviando el formulario. Intente nuevamente.
        });
      });
  }
};

let modalLoaded = false;
let modalInstance = null;

document.getElementById("openModalBtn").addEventListener("click", function () {
  if (!modalLoaded) {
    fetch("static/components/modalHelp.html")
      .then((response) => response.text())
      .then((data) => {
        const container = document.getElementById("modal-container");
        container.innerHTML = data;

        const modalElement = document.getElementById("modalHelp");
        if (modalElement) {
          modalInstance = new bootstrap.Modal(modalElement);
          modalInstance.show();
          modalLoaded = true;
        } else {
          console.error("Modal element not found in fetched content.");
        }
      })
      .catch((error) => console.error("Error loading modal:", error));
  } else {
    modalInstance.show();
  }
});

const updateMetadataFields = (data) => {
  // Model Details / Detalles del modelo
  const model = data["Detalles del modelo"];
  const metadata = data["Metadatos completos"];

  // Update Model Type / Actualizar Tipo de Modelo
  document.getElementById("modelType").innerText =
    model["Tipo de modelo"] || "No disponible";

  // Update Number of Trees / Actualizar Número de Árboles
  document.getElementById("numTrees").innerText =
    model["Número de árboles"] || "No disponible";

  // Update Training Date / Actualizar Fecha de Entrenamiento
  document.getElementById("trainingDate").innerText =
    metadata["training_details"]["training_date"] || "Desconocida";

  // Update Accuracy / Actualizar Precisión
  document.getElementById("accuracy").innerText =
    metadata["performance_metrics"]["accuracy"] !== undefined
      ? `${(metadata["performance_metrics"]["accuracy"] * 100).toFixed(2)}%`
      : "No disponible";

  // Update ROC AUC / Actualizar ROC AUC
  document.getElementById("rocAuc").innerText =
    metadata["performance_metrics"]["roc_auc"] !== undefined
      ? `${(metadata["performance_metrics"]["roc_auc"] * 100).toFixed(2)}%`
      : "No disponible";

  // Update Preprocessing / Actualizar Preprocesamiento
  const preprocessing = metadata.preprocessing;
  document.getElementById("preprocessing").innerText =
    preprocessing.encoding + ", " + preprocessing.scaling;

  // Update Training Time / Actualizar Tiempo de Entrenamiento
  document.getElementById("trainingTime").innerText =
    metadata["training_details"]["training_duration_seconds"] !== undefined
      ? `${metadata["training_details"]["training_duration_seconds"].toFixed(
          2
        )} sec`
      : "Desconocida";

  // Update Hardware Requirements / Actualizar Requisitos de Hardware
  const cpu = metadata["training_details"]["hardware_requirements"]["CPU"];
  const ram = metadata["training_details"]["hardware_requirements"]["RAM"];
  document.getElementById("hardwareRequirements").innerText =
    cpu && ram ? `CPU: ${cpu}, RAM: ${ram}` : "Desconocida";

  // Update Experiment Notes / Actualizar Notas del Experimento
  document.getElementById("experimentNotes").innerText =
    metadata.experiment?.notes || "No disponible";

  // Update Model Version / Actualizar Versión del Modelo
  document.getElementById("modelVersion").innerText =
    metadata.version?.model_version || "No disponible";

  // Update Dependencies / Actualizar Dependencias
  const dependencies = metadata.version?.dependencies;
  if (dependencies) {
    document.getElementById(
      "dependencies"
    ).innerText = `scikit-learn: ${dependencies["scikit-learn"]}, pandas: ${dependencies["pandas"]}, numpy: ${dependencies["numpy"]}`;
  } else {
    document.getElementById("dependencies").innerText = "No disponible";
  }
};
