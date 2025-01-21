
# Predictive Banking App

## Project Overview

**What does your application do?**  
This project is a web application based on an artificial intelligence (AI) model trained with a banking dataset. The model predicts the likelihood of a potential customer accepting or rejecting a fixed deposit based on certain profile data. The dataset contains the following fields:  
- `age`, `job`, `marital`, `education`, `default`, `balance`, `housing`, `loan`, `contact`, `day`, `month`, `duration`, `campaign`, `pdays`, `previous`, `poutcome`, `deposit`.

The model uses 80% of the data for training and the remaining 20% for prediction. The **Random Forest** algorithm was used due to its ability to handle nonlinear variables and its effectiveness in classification tasks like this one.

Once the model was trained, a web application was created where users can enter potential customer data. The application calculates and displays the acceptance probability of a fixed deposit, represented in a donut chart generated with **Chart.js**.

**What is the main purpose?**  
The main purpose of this project is to enable the prediction of fixed deposits for new customers through an interactive web interface, integrating **Machine Learning** and web development.

**Why did you create this project?**  
The goal of this project is to combine my knowledge of **Machine Learning** and web development, creating a scalable solution that allows predictions based on potential customer data.

---

## Main Features

- **Interactive web interface**: Users can input customer data via a form and receive a prediction.
- **Deposit prediction**: The model predicts whether the customer will accept a fixed deposit based on the entered data.
- **Dynamic chart**: The prediction is displayed as an interactive donut chart using **Chart.js**, allowing users to clearly see the acceptance and rejection probabilities.

---

## Technologies Used

- **Frontend**:  
  - **Bootstrap** for responsive design and styling.
  - **FontAwesome** for icons.
  - **SweetAlert** for dynamic alerts.
  - **CSS** for custom styling.
- **Backend**:  
  - **Python 3.13** as the programming language.
  - **Flask** as the web framework.
  - **Pandas**, **Joblib**, and **Scikit-learn** for data processing, model training, and predictions.

---

## Installation Instructions

To install and run this project on your local machine, follow these steps:

### 1. Clone the repository

```bash
git clone <repository_url>
cd <project_directory>
```

### 2. Create a virtual environment (optional but recommended)

```bash
python -m venv venv
source venv/bin/activate   # On macOS/Linux
venv\Scripts\activate      # On Windows
```

### 3. Install the dependencies

Install the necessary libraries using the `requirements.txt` file:

```bash
pip install -r requirements.txt
```

> Make sure you have **Python 3.13** installed.

### 4. Run the application

To start the server and run the application, execute the following command:

```bash
python index.py
```

The application will be available at `http://127.0.0.1:5000`.

---

## Usage

Once the application is running, you can interact with it through the browser. The interface allows you to input potential customer data (such as age, job, bank balance, etc.). After submitting the form, the model will make a prediction on the likelihood of the customer accepting a fixed deposit.

The results will be visually displayed in a donut chart indicating the acceptance and rejection probabilities.

---

## Contributions

This project is **open-source**. If you would like to contribute, you can clone the repository and submit your **pull requests**.

1. Fork the project.
2. Create a new branch (`git checkout -b new-feature`).
3. Make your changes and commit (`git commit -am 'Add new feature'`).
4. Push your changes (`git push origin new-feature`).
5. Open a **pull request**.

---

## License

This project does not have a specific license and uses **open-source libraries**.

---

## Authors

This project was developed by **Mauricio Andrés Garrido Valdés**, originally from Chile. The project was created on **January 22, 2025**, during his stay in **Auckland, New Zealand**.

---

Thank you for using **Predictive Banking App**!
