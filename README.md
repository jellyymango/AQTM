# AQTM

This repository contains the source code for the AQTM mobile application. Instructions for setting up the development environemnt and running the application are as follows:

--Install NodeJS, yarn, npm, and npx on the machine.

--Once installed, check versions of NodeJS, yarn, npm, and npx inside of a Command Prompt (not Powershell):

    -node -v
    -yarn -v
    -npm -v
    -npx -v

--Inside desired directory, create an empty Expo Go application by running the following command inside of a Command Prompt inside of the directory (you may need to navigate to this directory AFTER opening a Command Prompt): 
    
    -npx create-expo-app AQTM

--Inside of the newly created ./AQTM directory, delete all project files besides '.expo' and 'node_modules' folders if present.

--If present from previous step, move '.expo' and 'node_modules' folders into the previous directory to ensure ./AQTM is EMPTY.

--Copy AQTM repository into the nested folder ./AQTM.

--Move back '.expo' and 'node_modules' folders into the ./AQTM/AQTM repository folder (nested AQTM folder will be application folder).

--Inside of ./AQTM/AQTM and inside a Command Prompt, run the following commands to install necessary SDKs:

    -yarn add react-native-chart-kit
    -yarn add react-native-svg
    -npm i @expo/webpack-config
    -npx expo install expo-location
    -npx expo install expo-notifications

--Inside of ./AQTM/AQTM, run 'npx expo start' in a Command Prompt (not Powershell) window to start the application once, then press 
CTRL+C to stop server.

--Run the following command to install any final missing dependencies:

    -npx expo install --fix

--Now, running 'npx expo start' inside of the ./AQTM/AQTM directory will start the application, providing a QR code.

--On the mobile device, ensure Expo Go is installed and scan the QR code with the device camera. The application should now launch.



****************THE HARDWARE SETUP WILL BE INSIDE THE HW Arduino Code FOLDER, THERE WILL BE ANOTHER READ ME ************
