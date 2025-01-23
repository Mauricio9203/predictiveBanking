from flask import Blueprint, request, jsonify, send_file
import joblib
import pandas as pd
import tempfile

# Define the blueprint
bp = Blueprint('mass_predictions', __name__)

# Cargar el modelo, los codificadores y el escalador guardados
model_rf = joblib.load('models/trained/modelo_random_forest.pkl')
label_encoders = joblib.load('models/trained/codificadores.pkl')
scaler = joblib.load('models/trained/scaler.pkl')

@bp.route('/DepositApprovalPredictorBulk', methods=['POST'])
def metodosPost():
    try:
        # Verificar si se recibió un archivo
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']

        # Validar que el archivo sea Excel
        if not file.filename.endswith(('.xlsx', '.xls')):
            return jsonify({"error": "Invalid file type. Please upload an Excel file."}), 400

        # Leer el archivo Excel
        try:
            df = pd.read_excel(file)
        except Exception as e:
            return jsonify({"error": f"Error reading the Excel file: {str(e)}"}), 400

        # Verificar que el archivo contenga las columnas necesarias
        columns_usadas = ['age', 'job', 'marital', 'education', 'default', 'balance',
                          'housing', 'loan', 'contact', 'day', 'month', 'duration',
                          'campaign', 'pdays', 'previous', 'poutcome']

        missing_columns = [col for col in columns_usadas if col not in df.columns]
        if missing_columns:
            return jsonify({"error": f"Missing columns in the file: {', '.join(missing_columns)}"}), 400

        # Codificar las columnas categóricas usando los codificadores guardados solo si es necesario
        for column, le in label_encoders.items():
            if column in df.columns:
                df[column] = le.transform(df[column])

        # Escalar solo las columnas numéricas necesarias para la predicción
        num_columns = ['balance', 'day', 'campaign', 'pdays', 'previous', 'age', 'duration']
        df_scaled = df.copy()
        df_scaled[num_columns] = scaler.transform(df[num_columns])

        # Realizar la predicción para cada fila de datos con los datos escalados
        try:
            probabilidades = model_rf.predict_proba(df_scaled[columns_usadas])
        except Exception as e:
            return jsonify({"error": f"Error predicting with the model: {str(e)}"}), 400

        # Agregar las columnas de probabilidad y predicción sin alterar las existentes
        df['prob_yes'] = [prob[1] for prob in probabilidades]  # Probabilidad de "yes"
        df['prob_no'] = [prob[0] for prob in probabilidades]   # Probabilidad de "no"
        df['deposit'] = df['prob_yes'].apply(lambda x: 'yes' if x > 0.5 else 'no')  # Predicción final

        # Restaurar las columnas categóricas a sus valores originales (si las transformamos previamente)
        for column, le in label_encoders.items():
            if column in df.columns:
                df[column] = le.inverse_transform(df[column])

        # Crear un archivo temporal para guardar el resultado
        with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as temp_file:
            output_file = temp_file.name
            try:
                # Guardar el DataFrame en la primera hoja con el nombre "results"
                with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
                    df.to_excel(writer, index=False, sheet_name='results')

                    # Generar el resumen en formato vertical para la segunda hoja "Summary"
                    summary = pd.DataFrame({
                        'Metric': ['Total Records', 'Average Age', 'Highest Balance', 'Lowest Balance',
                                   'Standard Deviation of Balance', 'Most Common Job',
                                   'Most Common Marital Status', 'Missing Data', 'Number of Columns'],
                        'Value': [
                            len(df),
                            df['age'].mean() if 'age' in df.columns else 0,
                            df['balance'].max() if 'balance' in df.columns else 0,
                            df['balance'].min() if 'balance' in df.columns else 0,
                            df['balance'].std() if 'balance' in df.columns else 0,
                            df['job'].mode()[0] if 'job' in df.columns else 'N/A',
                            df['marital'].mode()[0] if 'marital' in df.columns else 'N/A',
                            df.isnull().sum().sum(),
                            len(df.columns)
                        ]
                    })
                    summary.to_excel(writer, index=False, sheet_name='Summary')

                    # Guardar las métricas en hojas separadas
                    # Deposit Distribution
                    deposit_dist = df['deposit'].value_counts().reset_index()
                    deposit_dist.columns = ['Deposit', 'Count']
                    deposit_dist.to_excel(writer, index=False, sheet_name='Deposit Distribution')

                    # Average Balance by Job
                    avg_balance_job = df.groupby('job')['balance'].mean().reset_index()
                    avg_balance_job.columns = ['Job', 'Average Balance']
                    avg_balance_job.to_excel(writer, index=False, sheet_name='Average Balance by Job')

                    # Average Balance by Marital Status
                    avg_balance_marital = df.groupby('marital')['balance'].mean().reset_index()
                    avg_balance_marital.columns = ['Marital Status', 'Average Balance']
                    avg_balance_marital.to_excel(writer, index=False, sheet_name='Average Balance by Marital Status')

            except Exception as e:
                return jsonify({"error": f"Error exporting to Excel: {str(e)}"}), 500

        # Devolver el archivo Excel como respuesta
        return send_file(output_file, as_attachment=True, download_name='resultado_con_predicciones.xlsx')

    except Exception as e:
        # Manejar errores generales
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
