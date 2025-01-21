from flask import Blueprint, request, jsonify
import joblib
import pandas as pd

# Define the blueprint
bp = Blueprint('deposit_approval_predictor', __name__)

# Cargar el modelo, los codificadores y el escalador guardados
model_rf = joblib.load('models/trained/modelo_random_forest.pkl')
label_encoders = joblib.load('models/trained/codificadores.pkl')
scaler = joblib.load('models/trained/scaler.pkl')

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
        prediccion = model_rf.predict(X_manual)
        probabilidad = model_rf.predict_proba(X_manual)

        # Crear una respuesta con los resultados de la predicción
        response_data = {
            "Job": job,
            "Marital Status": marital,
            "Education": education,
            "Default Status": defaultStatus,
            "Balance": balance,
            "Housing": housing,
            "Loan": loan,
            "Contact": contact,
            "Day": day,
            "Month": month,
            "Duration": duration,
            "Campaign": campaign,
            "Pdays": pdays,
            "Previous": previous,
            "Poutcome": poutcome,
            "Predicción": 'yes' if prediccion[0] == 1 else 'no',
            "Probabilidad de predicción": {
                "yes": probabilidad[0][1],
                "no": probabilidad[0][0]
            }
        }

        # Devolver la respuesta como JSON
        return jsonify(response_data), 200

    except Exception as e:
        # Manejar errores
        return jsonify({"error": str(e)}), 500
