# PLP-FCAS (Pamantasan ng Lungsod ng Pasig - Faculty Consultation and Attendance System)

## Purpose

The Faculty Consultation and Attendance System (FCAS) is a desktop application designed for Pamantasan ng Lungsod ng Pasig (PLP), specifically powered by the College of Computer Studies (CCS). The primary purpose of this application is to streamline and digitalize the logging of student consultations with faculty members.

Key features include:
- Student login via a 7-digit student number or QR code.
- User sign-up and password/account recovery portals.
- Consultation logging details, including selecting the professor, subject, and purpose of consultation.
- An offline-capable signature pad using signature_pad for students to securely sign off on their consultation logs.
- Dashboards for administrators and professors to track logs, view analytics, and generate reports.

## Prerequisites

Before setting up the project, ensure you have the following installed on your machine:
- Node.js (version 18 or higher recommended) and npm
- Rust toolchain (required for building and running Tauri applications)
- C++ build tools (Visual Studio Build Tools with C++ workload for Windows)

## Getting Started

Follow these steps to set up and run the application locally:

1. Clone the repository to your local machine.
2. Open your terminal in the root directory of the project.
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Run the application in development mode:
   ```bash
   npm run tauri dev
   ```
5. To build a production-ready desktop installer:
   ```bash
   npm run tauri build
   ```

## File Structure

The project is structured as a Tauri application with a React + TypeScript frontend. Below is an overview of the key directories and files:

- **api/**
  - `test.php`: Script for testing database connection/API interactions.
- **public/**
  - Static assets such as logos and background images served directly by the web server.
- **src-tauri/**
  - Contains all the Rust backend configuration and files for the Tauri desktop container.
  - `tauri.conf.json`: Core configuration file for Tauri settings, permissions, bundle configurations, and window properties.
  - `Cargo.toml`: Cargo manifest defining Rust dependencies and package settings.
  - `src/main.rs`: The entry point for the Tauri application.
- **src/**
  - The frontend application source code.
  - **assets/**: Images, logos, and animations (GIFs) used throughout the user interface.
  - **components/**: Reusable React components:
    - `SignUpModal.tsx` / `SignUpModal.css`: Modal sheet allowing students to sign up.
    - `RecoveryModal.tsx` / `RecoveryModal.css`: Modal allowing students to recover their login credentials.
    - `VisitFormModal.tsx` / `VisitFormModal.css`: The consultation logging form featuring the custom offline signature pad with signature guiding lines.
    - `SuccessModal.tsx` / `SuccessModal.css`: Visual confirmation screen displayed after a successful form submission.
  - **contexts/**: Global React Contexts:
    - `ToastContext.tsx` / `Toast.css`: System-wide toast notification service for alerts.
  - **pages/**: Route-level page layouts:
    - `MainPage.tsx` / `MainPage.css`: The student login portal, featuring keyboard listeners for numerical input and modal controls.
    - `ModuleSelection.tsx` / `ModuleSelection.css`: The entry gate for choosing between Admin, Professor, and Student portals.
  - `App.tsx`: The main root component setting up routes and context providers.
  - `main.tsx`: Entry point for React rendering the App component.
  - `App.css`: Application-wide style configurations.
- **index.html**
  - Entry HTML page for the Vite build.
- **package.json**
  - Node package configuration containing project scripts, dependencies (like react, react-router-dom, and signature_pad), and devDependencies.
- **tsconfig.json**
  - TypeScript configuration settings.
- **vite.config.ts**
  - Configurations for Vite compiling the TypeScript and React files.
