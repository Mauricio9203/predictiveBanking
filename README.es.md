
# Predictive Banking App

## Descripción General del Proyecto

**¿Qué hace tu aplicación?**  
Este proyecto es una aplicación web basada en un modelo de inteligencia artificial (IA) entrenado con un conjunto de datos bancarios. El modelo predice la probabilidad de que un cliente potencial acepte o no un depósito a plazo fijo en función de ciertos datos de perfil. El conjunto de datos contiene los siguientes campos:  
- `age`, `job`, `marital`, `education`, `default`, `balance`, `housing`, `loan`, `contact`, `day`, `month`, `duration`, `campaign`, `pdays`, `previous`, `poutcome`, `deposit`.

El modelo utiliza el 80% de los datos para el entrenamiento y el 20% restante para la predicción. Se utilizó el algoritmo **Random Forest** debido a su capacidad para manejar variables no lineales y su eficacia en tareas de clasificación como esta.

Una vez entrenado el modelo, se creó una aplicación web donde los usuarios pueden ingresar los datos de un cliente potencial. La aplicación calcula y muestra la probabilidad de aceptación del cliente para un depósito a plazo fijo, representada en un gráfico de dona generado con **Chart.js**.

**¿Cuál es el propósito principal?**  
El propósito principal de este proyecto es permitir la predicción de depósitos a plazo fijo para nuevos clientes mediante una interfaz web interactiva, integrando **Machine Learning** y desarrollo web.

**¿Por qué creaste este proyecto?**  
El objetivo de este proyecto es combinar mis conocimientos en **Machine Learning** y desarrollo web, creando una solución escalable que permita hacer predicciones basadas en datos de clientes potenciales.

---

## Características Principales

- **Interfaz web interactiva**: Los usuarios pueden ingresar los datos de los clientes a través de un formulario y obtener una predicción.
- **Predicción de depósitos**: El modelo predice si el cliente aceptará o no un depósito a plazo fijo basado en los datos ingresados.
- **Gráfico dinámico**: La predicción se muestra en forma de un gráfico de dona interactivo usando **Chart.js**, lo que permite a los usuarios ver la probabilidad de aceptación y rechazo de forma clara.
  
---

## Tecnologías Utilizadas

- **Frontend**: 
  - **Bootstrap** para el diseño y estilo responsivo.
  - **FontAwesome** para iconos.
  - **SweetAlert** para alertas dinámicas.
  - **CSS** para el estilo personalizado.
- **Backend**: 
  - **Python 3.13** como lenguaje de programación.
  - **Flask** como framework web.
  - **Pandas**, **Joblib**, y **Scikit-learn** para el procesamiento de datos, entrenamiento del modelo y predicciones.

---

## Instrucciones de Instalación

Para instalar y ejecutar este proyecto en tu máquina local, sigue los siguientes pasos:

### 1. Clona el repositorio

```bash
git clone <url_del_repositorio>
cd <directorio_del_proyecto>
```

### 2. Crear un entorno virtual (opcional pero recomendado)

```bash
python -m venv venv
source venv/bin/activate   # En macOS/Linux
venv\Scriptsctivate      # En Windows
```

### 3. Instalar las dependencias

Instala las bibliotecas necesarias usando el archivo `requirements.txt`:

```bash
pip install -r requirements.txt
```

> Asegúrate de tener **Python 3.13** instalado.

### 4. Ejecutar la aplicación

Para iniciar el servidor y ejecutar la aplicación, corre el siguiente comando:

```bash
python index.py
```

La aplicación estará disponible en `http://127.0.0.1:5000`.

---

## Uso

Una vez que la aplicación esté en funcionamiento, puedes interactuar con ella a través del navegador. La interfaz permite ingresar los datos de un cliente potencial (como edad, trabajo, saldo bancario, etc.). Al enviar el formulario, el modelo hará una predicción sobre la probabilidad de que el cliente acepte un depósito a plazo fijo.

Los resultados se mostrarán visualmente en un gráfico de dona que indica la probabilidad de aceptación y rechazo.

---

## Contribuciones

Este proyecto es de **código abierto**. Si deseas contribuir, puedes clonar el repositorio y enviar tus **pull requests**.

1. Haz un **fork** del proyecto.
2. Crea una nueva rama (`git checkout -b feature-nueva`).
3. Realiza los cambios y confirma (`git commit -am 'Agrega nueva funcionalidad'`).
4. Envía tus cambios (`git push origin feature-nueva`).
5. Abre un **pull request**.

---

## Licencia

Este proyecto no tiene una licencia específica y utiliza **librerías de código abierto**.

---

## Autores

Este proyecto fue desarrollado por **Mauricio Andrés Garrido Valdés**, originario de Chile. El proyecto fue realizado el **22 de enero de 2025** durante su estadía en **Auckland, Nueva Zelanda**.

---

¡Gracias por usar **Predictive Banking App**!
