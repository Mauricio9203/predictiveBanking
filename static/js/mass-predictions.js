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
