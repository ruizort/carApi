# 🚗 FrontEnd - Concesionaria - Alquiler de Autos

## Trabajo Final TP2

# CarAPI — API REST para gestión de autos, usuarios y reservas

### 🚀 Resumen del Proyecto

Este proyecto es un Sistema Integral para Concesionarias de Autos, enfocado en la gestión de inventario de los vehiculos, usuarios y alquiler de los mismos. Permite gestionar usuarios, autos y reservas con una arquitectura MVC clara
y código organizado para facilitar mantenimiento y escalabilidad. El sistema cumplirá con los requerimientos técnicos de la consigna del Trabajo Final TP2.

## ⚙️ Requisitos del Sistema

Para ejecutar este proyecto, necesitas tener instalados los siguientes programas:

1.  **Node.js** (versión recomendada: 18.x o superior)
2.  **npm** (se instala automáticamente con Node.js)
3.  **Git** (para clonar el repositorio)

---

## 🛠️ Instrucciones de Instalación y Ejecución

---

1. Clonar el repositorio:
   git clone <https://github.com/ruizort/carApi.git>

2. Instalar dependencias:
   npm install

3. Configurar la base de datos en:
   config/config.json

4. Iniciar el servidor:
   npm start

...

---

## TECNOLOGÍAS UTILIZADAS

- Node.js
- Express
- Sequelize ORM
- MySQL
- Nodemon
- Arquitectura MVC (Model - Controller - Routes)

---

## MODELOS

Usuario (User)

- id
- name
- email
- password
- role

Auto (Car)

- id
- brand
- model
- year
- imageUrl
- description

Reserva (Reservation)

- id
- userId
- carId
- startDate
- endDate
- totalPrice
- status

---

---

## ENDPOINTS DE LA API

USUARIOS
GET /users → listar usuarios
POST /users → crear usuario

AUTOS
GET /cars → listar autos
POST /cars → crear auto
PUT /cars/:id → actualizar auto por ID
DELETE /cars/:id → eliminar auto por ID

---

## SCRIPTS DISPONIBLES

npm start → inicia el servidor
npm run dev

---

## AUTOR

- Bocchini Franco
- Ruiz Nicolás Ignacio
- Benjamin Montalti

---

Proyecto desarrollado para entrega final de TP2 (Node, Express, Sequelize).
