document.addEventListener('DOMContentLoaded', () => {
  const uploadButton = document.getElementById('uploadButton');
  const fileInput = document.getElementById('fileInput');
  const fileNameDisplay = document.getElementById('fileName');
  const submitFileButton = document.getElementById('submitFile');
  const downloadButton = document.getElementById('downloadButton');
  const loadingIcon = document.getElementById('loadingIcon');
  let resultBlob = null;

  const expectedHeaders = [
    'age', 'job', 'marital', 'education', 'default', 'balance', 'housing', 'loan', 'contact',
    'day', 'month', 'duration', 'campaign', 'pdays', 'previous', 'poutcome'
  ];

  if (uploadButton) {
    uploadButton.addEventListener('click', () => {
      fileInput.click();
    });
  }

  // Validar el tipo de archivo
  const isValidFile = (file) => {
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    return validExtensions.includes('.' + fileExtension);
  };

  // Leer el archivo y verificar las cabeceras
  const validateExcelHeaders = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 }).shift(); // Obtener las cabeceras

      if (!headers) {
        Swal.fire('Error', 'The file is empty or cannot be read.', 'error');
        return;
      }

      // Comparar las cabeceras directamente
      const isValid = headers.length === expectedHeaders.length &&
                      headers.every((header, index) => header.trim().toLowerCase() === expectedHeaders[index]);

      if (isValid) {
        fileNameDisplay.innerHTML = `Selected file: ${file.name} <span id="removeFile" style="cursor: pointer; color: red;">&times;</span>`;
        const removeFileButton = document.getElementById('removeFile');
        removeFileButton.addEventListener('click', () => {
          fileInput.value = '';
          fileNameDisplay.innerHTML = '';
        });
      } else {
        Swal.fire('Invalid file structure', 'Missing or incorrect headers.', 'error');
        fileInput.value = ''; // Reset the file input
        fileNameDisplay.innerHTML = ''; // Clear file name display
      }
    };

    reader.onerror = (error) => Swal.fire('Error reading file', 'There was an error reading the file.', 'error');
    reader.readAsArrayBuffer(file);
  };

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!isValidFile(file)) {
        Swal.fire('Invalid file type', 'Please upload a valid Excel file (.xlsx, .xls)', 'error');
        fileInput.value = ''; // Reset the file input
        fileNameDisplay.innerHTML = ''; // Clear file name display
        return;
      }

      // Validar las cabeceras del Excel
      validateExcelHeaders(file);
    }
  });

  const handleFileUpload = () => {
    const file = fileInput.files[0];

    if (!file) {
      Swal.fire('No file selected', 'Please select a file to upload.', 'warning');
      return;
    }

    if (!isValidFile(file)) {
      Swal.fire('Invalid file type', 'Please upload a valid Excel file (.xlsx, .xls)', 'error');
      return;
    }

    // Deshabilitar el botón de predicción
    if (submitFileButton) {
      submitFileButton.disabled = true;
    }

    // Mostrar icono de carga
    if (loadingIcon) {
      loadingIcon.style.display = 'inline-block';
    }

    const formData = new FormData();
    formData.append('file', file);

    dataSummaryInfo.style.display = 'none';  // Hacer invisible el div
        
    fetch('/mass-predictions/DepositApprovalPredictorBulk', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (response.ok) {
        return response.blob();
      } else {
        throw new Error('Error uploading file');
      }
    })
    .then(blob => {
      resultBlob = blob;
      fileInput.value = '';
      fileNameDisplay.innerHTML = '';

      // Habilitar el botón de predicción
      if (submitFileButton) {
        submitFileButton.disabled = false;
      }

      if (loadingIcon) {
        loadingIcon.style.display = 'none';
      }
      downloadButton.style.display = 'inline-block';

      // Mostrar el div de Data Summary
      const dataSummaryInfo = document.getElementById('dataSummaryInfo');

      // Establecer un retraso de 1 segundo antes de hacer scroll
      setTimeout(() => {
        dataSummaryInfo.style.display = 'block';  // Hacer invisible el div
        dataSummaryInfo.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1000);  // 1000 milisegundos = 1 segundo

      // Leer el contenido del Excel y mostrar la segunda hoja
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });


        //datos tercera hoja
        const sheetThree = workbook.Sheets[workbook.SheetNames[2]];
        const summaryDataThree = XLSX.utils.sheet_to_json(sheetThree, { header: 1 });
        depositDistributionChart(summaryDataThree)

        //datos cuarta hoja
        const sheetFour = workbook.Sheets[workbook.SheetNames[3]];
        const summaryDataFour = XLSX.utils.sheet_to_json(sheetFour, { header: 1 });
        avgBalanceJobChart(summaryDataFour)

        //datos cuarta hoja
        const sheetFive = workbook.Sheets[workbook.SheetNames[4]];
        const summaryDataFive = XLSX.utils.sheet_to_json(sheetFive, { header: 1 });
        avgBalanceMaritalChart(summaryDataFive)

        // Obtener la segunda hoja (la de resumen)
        const sheet = workbook.Sheets[workbook.SheetNames[1]];

        // Convertir la segunda hoja a JSON
        const summaryData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Asignar valores de la segunda hoja a los elementos de la interfaz
        document.getElementById('totalRecords').innerText = summaryData[1][1] || 0;
        document.getElementById('averageAge').innerText = summaryData[2][1] || 0;
        document.getElementById('maxBalance').innerText = summaryData[3][1] || 0;
        document.getElementById('minBalance').innerText = summaryData[4][1] || 0;
        document.getElementById('stdDevBalance').innerText = summaryData[5][1] || 0;
        document.getElementById('commonJob').innerText = summaryData[6][1] || 'N/A';
        document.getElementById('commonMarital').innerText = summaryData[7][1] || 'N/A';
        document.getElementById('missingData').innerText = summaryData[8][1] || 0;
        document.getElementById('numColumns').innerText = summaryData[9][1] || 0;
      };

      reader.readAsArrayBuffer(blob);
    })
    .catch(error => {
      console.error('Error uploading file:', error);
      Swal.fire('Error', 'There was an error uploading the file. Please try again.', 'error');

      // Habilitar el botón de predicción en caso de error
      if (submitFileButton) {
        submitFileButton.disabled = false;
      }

      if (loadingIcon) {
        loadingIcon.style.display = 'none';
      }
    });
  };

  if (submitFileButton) {
    submitFileButton.addEventListener('click', handleFileUpload);
  }

  if (downloadButton) {
    downloadButton.addEventListener('click', () => {
      if (!resultBlob) {
        Swal.fire('No file available for download.');
        return;
      }

      const url = URL.createObjectURL(resultBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resultado_con_predicciones.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      downloadButton.style.display = 'none';
    });
  }
});

const depositDistributionChart = (data) => {
  let noValue = data[1][1];
  let siValue = data[2][1];

  // Destruir gráfico anterior si existe
  if (window.depositDistributionChartInstance) {
    window.depositDistributionChartInstance.destroy();
  }

  // Datos de distribución de depósitos
  const depositCounts = {
    "yes": siValue,
    "no": noValue
  };

  const labels = Object.keys(depositCounts);
  const values = Object.values(depositCounts);

  const ctx = document.getElementById('depositDistributionChart').getContext('2d');
  window.depositDistributionChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',  // Cambiar la posición de la leyenda a la parte inferior
          labels: {
            font: {
              size: 14,
              family: 'Arial, sans-serif',
              weight: 'bold'
            },
            padding: 20
          }
        },
        tooltip: {
          backgroundColor: '#000',
          titleFont: {
            size: 16,
            weight: 'bold'
          },
          bodyFont: {
            size: 14,
          },
          borderColor: '#36A2EB',
          borderWidth: 1,
          callbacks: {
            label: function(tooltipItem) {
              // Mostrar valor y porcentaje en el tooltip
              let value = tooltipItem.raw;
              let percentage = (value / values.reduce((a, b) => a + b)) * 100;
              return tooltipItem.label + ": " + value + " (" + percentage.toFixed(2) + "%)";
            }
          }
        },
        datalabels: {
          formatter: (value, context) => {
            const total = values.reduce((a, b) => a + b, 0);
            const percentage = (value / total * 100).toFixed(2);
            return `${value} (${percentage}%)`; // Mostrar número y porcentaje
          },
          color: 'black',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  });
};



//grafico balance jobs
const avgBalanceJobChart = (data) => {
  // Destruir gráfico anterior si existe
  if (window.avgBalanceJobChartInstance) {
    window.avgBalanceJobChartInstance.destroy();
  }

  // Preparar los datos reales de balance promedio por trabajo
  const avgBalanceByJob = {};

  data.slice(1).forEach(item => {
    const job = item[0];
    const balance = item[1];
    avgBalanceByJob[job] = { total: balance, count: 1 };
  });

  const jobs = Object.keys(avgBalanceByJob);
  const avgBalances = jobs.map(job => avgBalanceByJob[job].total / avgBalanceByJob[job].count);

  const ctx = document.getElementById('avgBalanceJobChart').getContext('2d');
  window.avgBalanceJobChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: jobs,
      datasets: [{
        label: 'Average Balance',
        data: avgBalances,
        backgroundColor: '#FF6384',
        borderColor: '#FF6384',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,  // Ajuste responsivo
      maintainAspectRatio: false, // Permite que el gráfico se ajuste sin perder proporciones
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            display: false
          },
          ticks: {
            font: { size: 14 }
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            font: { size: 14 },
            callback: function(value) {
              return '$' + value.toFixed(0);
            }
          },
          grid: { display: true, color: '#ddd' }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#000',
          titleFont: { size: 16, weight: 'bold' },
          bodyFont: { size: 14, color: '#000' },
          borderColor: '#FF6384',
          borderWidth: 1,
          callbacks: {
            label: function(tooltipItem) {
              let value = tooltipItem.raw;
              let total = avgBalances.reduce((a, b) => a + b, 0);
              let percentage = (value / total) * 100;
              return tooltipItem.label + ": $" + value.toFixed(0) + " (" + percentage.toFixed(2) + "%)";
            }
          }
        },
        datalabels: {
          formatter: (value, context) => {
            const total = avgBalances.reduce((a, b) => a + b, 0);
            const percentage = (value / total * 100).toFixed(2);
            return `$${value} (${percentage}%)`; // Mostrar número y porcentaje
          },
          color: 'black',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  });
};



// Gráfico de Barras: Average Balance by Marital Status
const avgBalanceMaritalChart = (data) => {
  // Destruir gráfico anterior si existe
  if (window.avgBalanceMaritalChartInstance) {
    window.avgBalanceMaritalChartInstance.destroy();
  }

  // Preparar los datos reales de balance promedio por estado civil
  const avgBalanceByMarital = {};

  data.slice(1).forEach(item => {
    const maritalStatus = item[0];
    const balance = item[1];
    avgBalanceByMarital[maritalStatus] = { total: balance, count: 1 };
  });

  const maritalStatuses = Object.keys(avgBalanceByMarital);
  const avgBalances = maritalStatuses.map(status => avgBalanceByMarital[status].total / avgBalanceByMarital[status].count);

  const ctx = document.getElementById('avgBalanceMaritalChart').getContext('2d');
  window.avgBalanceMaritalChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: maritalStatuses,
      datasets: [{
        label: 'Average Balance',
        data: avgBalances,
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,  // Ajuste responsivo
      maintainAspectRatio: false, // Permite que el gráfico se ajuste sin perder proporciones
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            display: false
          },
          ticks: {
            font: { size: 14 }
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            font: { size: 14 },
            callback: function(value) {
              return '$' + value.toFixed(0);
            }
          },
          grid: { display: true, color: '#ddd' }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#000',
          titleFont: { size: 16, weight: 'bold' },
          bodyFont: { size: 14, color: '#000' },
          borderColor: '#36A2EB',
          borderWidth: 1,
          callbacks: {
            label: function(tooltipItem) {
              let value = tooltipItem.raw;
              let total = avgBalances.reduce((a, b) => a + b, 0);
              let percentage = (value / total) * 100;
              return tooltipItem.label + ": $" + value.toFixed(0) + " (" + percentage.toFixed(2) + "%)";
            }
          }
        },
        datalabels: {
          formatter: (value, context) => {
            const total = avgBalances.reduce((a, b) => a + b, 0);
            const percentage = (value / total * 100).toFixed(2);
            return `$${value} (${percentage}%)`; // Mostrar número y porcentaje
          },
          color: 'black',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  });
};








