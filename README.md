# Ulcer Paralysis Monitoring 
This project details the development of a sensor-based system designed to monitor patients with pressure ulcers and paralysis, enhancing their safety and communication with healthcare providers.

## Key Features:
-Fall Detection:Utilizes FSR9 sensors to identify falls from the bed, potentially preventing pressure ulcer worsening and injuries.
-Improved Patient Communication: Incorporates a TTP226 capacitive touch sensor that allows patients to send requests to healthcare providers with a simple touch, promoting patient well-being and reducing call burden.
-Movement Monitoring: Employs accelerometer sensors to detect potentially harmful movements or improper positioning, enabling timely intervention by healthcare staff.
-Real-time Vital Sign Monitoring: Implements a pulse sensor to track patient's heart rate, providing crucial data for healthcare providers in emergency situations.

## Prototype Development:
The project utilizes an Arduino Uno microcontroller as the central processing unit, along with TTP226 capacitive touch sensors, accelerometer sensors, jumper wires, and a breadboard to create a functional prototype.

## Data Visualization and Alert System:

A web application built with ReactJS serves as a nurse dashboard, displaying real-time patient data in clear graphs and numerical formats. The dashboard incorporates a threshold-based alert system that triggers warnings or danger messages when monitored parameters deviate from safe ranges, notifying nurses of potential patient concerns.

## Technologies Used in website
- ReactJS
- RECharts
- HTML
- CSS
- Toastify

## Team Members
|  Name |
| --- |
| Caroline Ehab |
| Hamza Elghonemy |
| Mohamed Abdelrazik |
| Moamen Ehab |

## Pictures From The Website

!["Nurse Dashboard with danger signs and pop up messages from the patient"](Dashboard.jpg)
!["Nurse Dashboard with warning signs"](Warnings.jpg)
