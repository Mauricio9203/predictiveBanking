from flask import Blueprint, request, jsonify
import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, recall_score, precision_score, f1_score
import json

# Define the blueprint
bp = Blueprint('deposit_approval_predictor', __name__)

# Cargar el modelo, los codificadores y el escalador guardados
model_rf = joblib.load('models/trained/modelo_random_forest.pkl')
label_encoders = joblib.load('models/trained/codificadores.pkl')
scaler = joblib.load('models/trained/scaler.pkl')

# Cargar los metadatos desde el archivo JSON
with open('models/trained/metadata.json', 'r') as f:
    model_metadata = json.load(f)  # Cargar metadatos en un diccionario

@bp.route('/DepositApprovalPredictor', methods=['POST'])
def metodosPost():
    try:
        # Obtener los datos JSON de la solicitud
        data = request.get_json()

        # Almacenar cada campo en una variable
        job = data.get("Job")
        marital = data.get("Marital Status")
        education = data.get("Education")
        age = data.get("Age")
        defaultStatus = data.get("Default Status")
        balance = data.get("Balance")
        housing = data.get("Housing")
        loan = data.get("Loan")
        contact = data.get("Contact")
        day = data.get("Day")
        month = data.get("Month")
        duration = data.get("Duration")
        campaign = data.get("Campaign")
        pdays = data.get("Pdays")
        previous = data.get("Previous")
        poutcome = data.get("Poutcome")

        # Crear un diccionario con los datos recibidos para la predicción
        datos_manual = {
            "age": age, 
            "job": job,
            "marital": marital,
            "education": education,
            "default": defaultStatus,
            "balance": balance,
            "housing": housing,
            "loan": loan,
            "contact": contact,
            "day": day,
            "month": month,
            "duration": duration,
            "campaign": campaign,
            "pdays": pdays,
            "previous": previous,
            "poutcome": poutcome
        }

        # Codificar las columnas categóricas usando los codificadores guardados
        for column, le in label_encoders.items():
            datos_manual[column] = le.transform([datos_manual[column]])[0]

        # Definir el orden correcto de las columnas que se usaron durante el entrenamiento
        columns_usadas = ['age', 'job', 'marital', 'education', 'default', 'balance',
                          'housing', 'loan', 'contact', 'day', 'month', 'duration',
                          'campaign', 'pdays', 'previous', 'poutcome']

        # Crear un DataFrame con las columnas correctas
        X_manual = pd.DataFrame([datos_manual])[columns_usadas]

        # Escalar las columnas numéricas
        num_columns = ['balance', 'day', 'campaign', 'pdays', 'previous', 'age', 'duration']
        X_manual[num_columns] = scaler.transform(X_manual[num_columns])

        # Realizar la predicción y obtener la probabilidad
        probabilidad = model_rf.predict_proba(X_manual)

        # Obtener importancia de las variables
        feature_importances = model_rf.feature_importances_
        importance_data = {
            column: importance for column, importance in zip(columns_usadas, feature_importances)
        }

        # Calcular métricas de rendimiento si la metadata incluye datos de validación
        performance_metrics = {}
        if 'y_true' in model_metadata and 'y_pred' in model_metadata:
            y_true = model_metadata['y_true']
            y_pred = model_metadata['y_pred']
            performance_metrics = {
                "accuracy": accuracy_score(y_true, y_pred),
                "recall": recall_score(y_true, y_pred, average='binary'),
                "precision": precision_score(y_true, y_pred, average='binary'),
                "f1_score": f1_score(y_true, y_pred, average='binary')
            }
        else:
            # Si no hay datos de validación, puedes calcular las métricas con el conjunto de prueba
            y_true = model_metadata.get('y_test', None)
            if y_true is not None:
                y_pred = model_rf.predict(X_test)
                performance_metrics = {
                    "accuracy": accuracy_score(y_true, y_pred),
                    "recall": recall_score(y_true, y_pred, average='binary'),
                    "precision": precision_score(y_true, y_pred, average='binary'),
                    "f1_score": f1_score(y_true, y_pred, average='binary')
                }

        # Crear una respuesta con los resultados de la predicción y detalles del modelo
        response_data = {
            "Probabilidad de predicción": {
                "yes": probabilidad[0][1],
                "no": probabilidad[0][0]
            },
            "Detalles del modelo": {
                "Tipo de modelo": "Random Forest",
                "Número de árboles": model_rf.n_estimators,
                "Profundidad máxima": model_rf.max_depth,
                "Criterio": model_rf.criterion,
                "Importancia de características": importance_data,
                "Fecha de entrenamiento": model_metadata.get('training_date', 'Desconocida'),
                "Versión de dependencias": model_metadata.get('dependencies', {})
            },
            "Rendimiento del modelo": performance_metrics,
            "Historial de predicciones": model_metadata.get('prediction_history', []),
            "Importancia de características para gráfico": {
                "labels": list(importance_data.keys()),  # Características
                "data": list(importance_data.values())   # Importancia
            },
            "Metadatos completos": model_metadata  # Agregar los metadatos completos aquí
        }

        # Devolver la respuesta como JSON
        return jsonify(response_data), 200

    except Exception as e:
        # Manejar errores
        return jsonify({"error": str(e)}), 500
