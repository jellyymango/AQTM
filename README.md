# AQTM

This repository contains the source code for the AQTM mobile application. Instructions for setting up the development environemnt are as follows:

--Ensure that recent versions of NodeJS, yarn, npm, and npx are installed on the machine.

--Check versions of NodeJS, yarn, npm, and npx inside of a Command Prompt (not Powershell).

--Create project folder './AQTM' with blank Expo Go App inside, using 'npx create-expo-app AQTM'.

--Delete all application files besides '.expo' and 'node_modules' folders.

--Create new blank folder AQTM to copy repository into.

--Copy AQTM repository into the nested folder ./AQTM/AQTM.

--Cut and paste '.expo' and 'node_modules' folders into the ./AQTM/AQTM repository folder (nested AQTM folder will be application folder).

--Inside of ./AQTM/AQTM and inside a Command Prompt, run the following commands to install necessary SDKs:

    -yarn add react-native-chart-kit
    -yarn add react-native-svg
    -npm i @expo/webpack-config
    -npx expo install expo-location

--If any remaining dependencies are specified as uninstalled, follow instructions to install them

--Inside of ./AQTM/AQTM, run 'npx expo start' in a Command Prompt (not Powershell) window to start the application and display QR code for the Expo Go mobile app




****************THE HARDWARE SETUP WILL BE INSIDE THE HW Arduino Code FOLDER, THERE WILL BE ANOTHER READ ME ************
