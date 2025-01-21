from flask import Flask, render_template

#importaciones de archivos de backend
from controllers.deposit_approval_predictor import bp as DepositApprovalPredictor

# Cargar las configuraciones desde config.py
app = Flask(__name__)
app.config.from_object('config.Config')  # Carga la configuración de la clase Config

# Registrar el blueprint
app.register_blueprint(DepositApprovalPredictor)

# Rutas principales de la aplicación Flask
@app.route('/')
def principal():
    return render_template('index.html')

@app.route('/DepositApprovalPredictor')
def DepositApprovalPredictor():
    return render_template('deposit-approval-predictor.html')

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'], host=app.config['HOST'], port=app.config['PORT'])
