# 🚚 Zen Logistics API

> Una API RESTful escalable y modular para la gestión logística de transporte, construida con NestJS y Arquitectura Orientada a Servicios.

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

## 📋 Descripción

**Zen Logistics** conecta a **Clientes** con **Conductores** en tiempo real. Este backend está diseñado con un enfoque en la **Alta Disponibilidad**, **Escalabilidad** y **Seguridad**.

El sistema resuelve la complejidad de gestionar múltiples tipos de usuarios (perfiles diferenciados), autenticación segura y optimización de latencia mediante caché distribuida.

### Características Principales

- **Autenticación Híbrida:** Soporte robusto para registro Local (Email/Password) y OAuth 2.0 (Google).
- **Seguridad Avanzada:** Hashing con **Argon2**, JWT (Access + Refresh Tokens con rotación) y Cookies HttpOnly.
- **Cache-Aside Pattern:** Implementación de **Redis** para reducir la latencia de validación de tokens de ~15ms a **<1ms**.
- **Roles Dinámicos:** Separación lógica y de validación estricta entre Clientes y Conductores.
- **Infraestructura como Código:** Entorno de desarrollo completo (Base de Datos + Caché + Admin) dockerizado.

## 🏗️ Arquitectura y Rendimiento

El proyecto sigue una arquitectura modular inspirada en DDD (Domain Driven Design).

### Estrategia de Caché (Redis)

Se implementó el patrón **Cache-Aside** en la estrategia de autenticación (`JwtStrategy`) para maximizar el rendimiento:

1.  **Fast Path:** Al recibir una petición, la API busca al usuario en Redis (Memoria RAM). Si existe, responde en microsegundos.
2.  **Slow Path:** Si no está en Redis, consulta PostgreSQL, valida y guarda en caché para futuras peticiones.
3.  **Resiliencia:** El sistema es tolerante a fallos; si Redis cae, el backend conmuta automáticamente a PostgreSQL sin interrumpir el servicio.

### Base de Datos

- **PostgreSQL:** Motor principal para persistencia de datos relacionales y transacciones críticas.
- **TypeORM:** ORM utilizado para el modelado de entidades y migraciones seguras.

## 🚀 Guía de Instalación y Ejecución

Sigue estos pasos para levantar el proyecto en tu máquina local.

### 1. Prerrequisitos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (debe estar corriendo)

## 2. Clonar el Repositorio

## 3. Configuración de Variables de Entorno

Crea un archivo llamado `.env` en la raíz del proyecto y pega la siguiente configuración base:

```env

# --- BASE DE DATOS (PostgreSQL) ---
# ¡IMPORTANTE: Cambiar valor de password!
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=zen_logistics_db

# --- CACHÉ (Redis) ---
REDIS_HOST=localhost
REDIS_PORT=6379

# --- SEGURIDAD ---
# ¡IMPORTANTE: Cambiar secretos en producción!
JWT_SECRET=secreto_para_desarrollo_local
JWT_EXP=15m
JWT_REFRESH=secreto_para_desarrollo_local
JWT_REFRESH_EXPIRATION=7d

# --- HERRAMIENTAS (PgAdmin) ---
PG_EMAIL=admin@admin.com
PG_PASSWORD=root
PG_PORT=5050
```

## 4. Levantar Infraestructura

```bash
docker compose up -d
```

## 5. Ejecutar la Aplicación

```bash
# Modo Desarrollo
npm run start:dev

# Modo Producción (Compilado)
npm run build
npm run start:prod
```
