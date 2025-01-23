import logging
from flask import Flask, render_template
from flask_cors import CORS  # Importar CORS

# Importaciones de archivos de backend
from controllers.deposit_approval_predictor import bp as DepositApprovalPredictor
from controllers.mass_predictions import bp as MassivePredictions

# Crear la instancia de Flask
app = Flask(__name__)
app.config.from_object('config.Config')  # Carga la configuración de la clase Config

# Habilitar CORS globalmente
CORS(app)

# Habilitar el log de errores
if not app.debug:
    logging.basicConfig(level=logging.ERROR)

# Registrar los blueprints
app.register_blueprint(DepositApprovalPredictor)
app.register_blueprint(MassivePredictions, url_prefix='/mass-predictions')  # Asegúrate de usar un prefix si lo necesitas

# Rutas principales de la aplicación Flask
@app.route('/')
def principal():
    return render_template('index.html')

@app.route('/DepositApprovalPredictor')
def deposit_approval_predictor_view():
    return render_template('deposit-approval-predictor.html')

@app.route('/MassivePredictions')
def massive_predictions_view():
    return render_template('mass-predictions.html')

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'], host=app.config['HOST'], port=app.config['PORT'])
