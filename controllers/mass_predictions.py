from flask import Blueprint, request, jsonify, send_file
import joblib
import pandas as pd
import tempfile
import logging

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

        # Codificar las columnas categóricas usando los codificadores guardados
        for column, le in label_encoders.items():
            if column in df.columns:
                try:
                    df[column] = le.transform(df[column])
                except Exception as e:
                    return jsonify({"error": f"Error encoding column {column}: {str(e)}"}), 400

        # Escalar las columnas numéricas
        num_columns = ['balance', 'day', 'campaign', 'pdays', 'previous', 'age', 'duration']
        for col in num_columns:
            if col not in df.columns:
                return jsonify({"error": f"Missing numerical column: {col}"}), 400
        
        try:
            df[num_columns] = scaler.transform(df[num_columns])
        except Exception as e:
            return jsonify({"error": f"Error scaling numerical columns: {str(e)}"}), 400

        # Realizar la predicción para cada fila de datos y obtener las probabilidades
        try:
            probabilidades = model_rf.predict_proba(df[columns_usadas])
        except Exception as e:
            return jsonify({"error": f"Error predicting with the model: {str(e)}"}), 400

        # Agregar las columnas de probabilidad y predicción
        df['prob_yes'] = [prob[1] for prob in probabilidades]  # Probabilidad de "yes"
        df['prob_no'] = [prob[0] for prob in probabilidades]   # Probabilidad de "no"
        df['deposit'] = df['prob_yes'].apply(lambda x: 'yes' if x > 0.5 else 'no')  # Predicción final

        # Crear un archivo temporal para guardar el resultado
        with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as temp_file:
            output_file = temp_file.name
            try:
                df.to_excel(output_file, index=False)
            except Exception as e:
                return jsonify({"error": f"Error exporting to Excel: {str(e)}"}), 500

        # Devolver el archivo Excel como respuesta
        return send_file(output_file, as_attachment=True, download_name='resultado_con_predicciones.xlsx')

    except Exception as e:
        # Manejar errores generales
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
