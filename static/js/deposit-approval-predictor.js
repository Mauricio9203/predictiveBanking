// Constants *********************************************************************************
document.title = "Deposit Approval Predictor"; // Title module / Módulo de título

// Select button elements
const boton = document.getElementById("submitForm"); // Spanish: Seleccionar el botón
const submitButton = document.getElementById('submitForm'); // Spanish: Botón de envío
const loadingButton = document.getElementById('submitLoading'); // Spanish: Botón de carga

// Events when the page loads
document.addEventListener("DOMContentLoaded", function () { // Spanish: Eventos al cargar la página
  const monthField = document.getElementById("month"); // Spanish: Campo de mes
  const dayField = document.getElementById("day"); // Spanish: Campo de día
  const dayLabel = document.getElementById("labelDay"); // Spanish: Etiqueta de día

  // Days in each month
  const daysInMonth = { // Spanish: Días de cada mes
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
  monthField.addEventListener("change", function () { // Spanish: Evento de cambio para el campo de mes
    const selectedMonth = monthField.value; // Spanish: Mes seleccionado
    const maxDays = daysInMonth[selectedMonth] || 31; // Default to 31 if not selected / Predeterminado a 31 si no se selecciona
    dayField.max = maxDays; // Update the maximum days for the day field / Actualiza el número máximo de días en el campo de día

    // If the current day exceeds the max, adjust it automatically
    if (parseInt(dayField.value) > maxDays) { // Spanish: Si el día actual excede el máximo, ajustarlo automáticamente
      dayField.value = maxDays;
      dayLabel.textContent = maxDays;
    }
  });

  // Input event for day field
  dayField.addEventListener("input", function () { // Spanish: Evento de entrada para el campo de día
    dayLabel.textContent = dayField.value; // Update day label / Actualizar la etiqueta de día
  });
});

// Submit form event ***********************************************************************************
document.getElementById("submitForm").addEventListener("click", (event) => { // Spanish: Evento de envío del formulario
submitForm()
});
document.getElementById("submitFlex").addEventListener("click", (event) => { // Spanish: Evento de envío del formulario
  submitForm()
  });



// Fill form fields event / Evento para llenar campos del formulario
document.getElementById("llenarCampos").addEventListener("click", (event) => { // Spanish: Evento para llenar los campos
  fillFormFields(); // Spanish: Llenar los campos del formulario
});

// Generic function to update any label / Función genérica para actualizar cualquier etiqueta
const updateLabel = (rangeId, labelId) => {
  document.getElementById(labelId).textContent = document.getElementById(rangeId).value; // Actualiza el texto de la etiqueta
};

// Age changes event / Evento para cambios en edad
document.getElementById('age').addEventListener('input', () => updateLabel('age', 'labelAge')); 

// Day changes event / Evento para cambios en el día
document.getElementById('day').addEventListener('input', () => updateLabel('day', 'labelDay'));

// Init tooltip / Inicializar tooltip
document.addEventListener("DOMContentLoaded", function () { // Spanish: Inicialización de tooltip
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
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
  updateLabel('age', 'labelAge');
  updateLabel('day', 'labelDay');
};

// Fetch modal when needed / Cargar el modal cuando sea necesario
const getModal = () => {
    fetch('modal.html') // Spanish: Cargar archivo del modal
    .then(response => response.text()) 
    .then(data => {
      document.getElementById('modal-container').innerHTML = data; // Insert content in container / Insertar contenido en el contenedor
    })
    .catch(error => console.error('Error cargando el modal:', error)); 
};

// Create probability pie chart function / Función para crear gráfico de probabilidad
const createFixedProbabilityPieChart = (probYes, probNo) => { 
  const canvas = document.getElementById('probabilityPieChart'); // Canvas element / Elemento canvas

  if (!canvas) {
    console.error('No se encontró el canvas con el id "probabilityPieChart"'); // Canvas not found / Canvas no encontrado
    return;
  }

  // Destroy previous chart if exists / Destruir gráfico anterior si existe
  if (window.probabilityPieChart && window.probabilityPieChart instanceof Chart) {
    window.probabilityPieChart.destroy();
    console.log("Gráfico anterior destruido");

    canvas.width = canvas.width; // Clean canvas / Limpiar canvas
  }

  // Calculate percentages / Calcular porcentajes
  const probYesPercentage = (probYes * 100).toFixed(2); 
  const probNoPercentage = (probNo * 100).toFixed(2); 

  let labelYes = `Yes (${probYesPercentage}%)`; // Spanish: Sí
  let labelNo = `No (${probNoPercentage}%)`; // Spanish: No

  const ctx = canvas.getContext('2d'); // Context for drawing / Contexto para dibujar
  const gradientYes = ctx.createLinearGradient(0, 0, 0, canvas.height); 
  gradientYes.addColorStop(0, '#4A90E2'); // Blue gradient / Gradiente azul
  gradientYes.addColorStop(1, '#81C8FA'); 

  const gradientNo = ctx.createLinearGradient(0, 0, 0, canvas.height); 
  gradientNo.addColorStop(0, '#E57373'); // Red gradient / Gradiente rojo
  gradientNo.addColorStop(1, '#FF9A9A'); 

  window.probabilityPieChart = new Chart(canvas, { // Create the pie chart / Crear gráfico circular
    type: 'doughnut', 
    data: {
      labels: [labelYes, labelNo], 
      datasets: [{
        label: 'Probabilidad', 
        data: [probYes * 100, probNo * 100], 
        backgroundColor: [gradientYes, gradientNo], 
        borderColor: ['#1E88E5', '#E53935'], 
        borderWidth: [3, 1], 
        hoverOffset: 10 
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 10, bottom: 10 }},
      plugins: {
        legend: {
          display: true, position: 'right',
          labels: { font: { family: 'Poppins, sans-serif', size: 14 }, color: '#333' }
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              const dataLabel = tooltipItem.label || '';
              const value = tooltipItem.raw;
              return `${dataLabel}: ${value.toFixed(2)}%`; 
            },
            footer: function() {
              return 'Probabilidades totales: 100%'; 
            }
          },
          bodyFont: { family: 'Poppins, sans-serif', size: 12 }
        }
      },
      animation: {
        duration: 1500,
        easing: 'easeOutBounce'
      }
    }
  });

  // Accessibility / Accesibilidad
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Gráfico circular mostrando probabilidades de Yes y No');
};

// Show chart function / Función para mostrar gráfico
function showChart() {
  document.getElementById('probGrafDiv').classList.remove('d-none');
  document.getElementById('probGrafDiv').classList.add('show');
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

  let missingFields = fields.filter(field => !document.getElementById(field.id).value)
                             .map(field => field.label); // Spanish: Filtra los campos vacíos

  // Check if there are missing fields / Verificar si faltan campos
  if (missingFields.length > 0) { // Spanish: Si faltan campos
    // Show SweetAlert with missing fields
    Swal.fire({
      icon: 'info',
      title: 'Incomplete Fields', // Spanish: Campos incompletos
      text: 'Please complete the following fields: ' + missingFields.join(', '), // Spanish: Por favor complete los siguientes campos
    });
  } else { // If all fields are completed, proceed with processing / Si todos los campos están completos, continuar con el procesamiento
    const formData = fields.reduce((data, field) => { // Spanish: Recopilar datos del formulario
      data[field.label] = document.getElementById(field.id).value;
      return data;
    }, {});

    // Hide the spinner after receiving the response / Ocultar el spinner después de recibir la respuesta
    document.querySelector('.spinner-grow').classList.remove('d-none'); // Remove spinner visibility
    loadingButton.classList.add('d-none'); // Hide the loading button / Ocultar el botón de carga
    submitButton.classList.remove('d-none'); // Show the submit button / Mostrar el botón de envío

    // Send the form data to the backend using fetch
    fetch('/DepositApprovalPredictor', { // Spanish: Enviar datos del formulario al backend usando fetch
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Spanish: Tipo de contenido JSON
      },
      body: JSON.stringify(formData) // Convert form data to JSON / Convertir los datos del formulario a JSON
    })
    .then(response => response.json()) // Parse JSON response / Analizar la respuesta en JSON
    .then(data => {
      showChart(); // Display chart / Mostrar gráfico
    
      const probNo = data["Probabilidad de predicción"]["no"]; // Spanish: Probabilidad de "No"
      const probYes = data["Probabilidad de predicción"]["yes"]; // Spanish: Probabilidad de "Sí"

      createFixedProbabilityPieChart(probYes, probNo); // Create chart with data / Crear gráfico con los datos

      // Scroll to form section smoothly / Desplazar el contenido hacia el formulario suavemente
      document.getElementById('llenarCampos').scrollIntoView({
        behavior: 'smooth', // Smooth scroll effect / Efecto de desplazamiento suave
        block: 'start'      // Align to top of the page / Alineación en la parte superior
      });
    })
    .catch(error => { // Spanish: Manejar errores
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Error', // Spanish: Error en el envío
        text: 'There was an error submitting your form. Please try again.', // Spanish: Hubo un error enviando el formulario. Intente nuevamente.
      });
    });
  }
};


let modalLoaded = false;
let modalInstance = null;

document.getElementById('openModalBtn').addEventListener('click', function () {
  if (!modalLoaded) {
    fetch('static/components/modalHelp.html')
      .then(response => response.text())
      .then(data => {
        const container = document.getElementById('modal-container');
        container.innerHTML = data;

        const modalElement = document.getElementById('modalHelp');
        if (modalElement) {
          modalInstance = new bootstrap.Modal(modalElement);
          modalInstance.show();
          modalLoaded = true;
        } else {
          console.error('Modal element not found in fetched content.');
        }
      })
      .catch(error => console.error('Error loading modal:', error));
  } else {
    modalInstance.show();
  }
});

