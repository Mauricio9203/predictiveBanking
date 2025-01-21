# models/train/train_model.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
import joblib

def train_model():
    # Cargar el dataset
    data = pd.read_csv('models/data_train/bank.csv')

    # Preparar los datos
    cat_columns = ['job', 'marital', 'education', 'default', 'housing', 'loan', 'contact', 'poutcome', 'month']
    num_columns = ['balance', 'day', 'campaign', 'pdays', 'previous', 'age', 'duration']

    # Codificar las columnas categóricas
    label_encoders = {}
    for column in cat_columns:
        le = LabelEncoder()
        data[column] = le.fit_transform(data[column])
        label_encoders[column] = le  # Guardar el codificador

    # Escalar las columnas numéricas
    scaler = StandardScaler()
    data[num_columns] = scaler.fit_transform(data[num_columns])

    # Dividir los datos en entrenamiento y prueba
    X = data.drop(columns=['deposit'])  # Eliminar la columna objetivo
    y = data['deposit'].apply(lambda x: 1 if x == 'yes' else 0)  # Convertir a binario
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Entrenar el modelo
    model_rf = RandomForestClassifier(random_state=42)
    model_rf.fit(X_train, y_train)

    # Guardar el modelo, codificadores y escalador
    joblib.dump(model_rf, 'models/trained/modelo_random_forest.pkl')
    joblib.dump(label_encoders, 'models/trained/codificadores.pkl')
    joblib.dump(scaler, 'models/trained/scaler.pkl')

    print("Modelo, codificadores y escalador guardados exitosamente.")

# Ejecutar el entrenamiento
if __name__ == "__main__":
    train_model()
