🛠️ Quick Start Guide

1. ## Clone the Repository:

        '''bash
        git clone https://github.com/yourusername/base-meme-arena.git
        cd base-meme-arena
        '''


2. ## Install Dependencies:
        '''bash
        npm install
        '''


3. ## Set Up Firebase:

    **Go to Firebase Console.**

    **Create a new project.**

    **Enable Firestore, Firebase Authentication, and Firebase Storage.**

    **Replace the Firebase config in src/firebase.js with your project's credentials.**

**Seed Initial Data:**

4. ## Run the seedCoins.js script to populate the Firestore with initial meme coins.

        '''bash
        node src/seedCoins.js
        '''

5. ## Run the Application Locally:

        '''bash
        npm start
        '''


Visit http://localhost:3000 to view the app in action.

6. ## Deploy to Firebase Hosting:

    **Initialize Firebase Hosting:**

        '''bash
        firebase init hosting
        '''

    **Build the project:**

        '''bash
        
        npm run build
        '''


    **Deploy:**

        '''bash

        firebase deploy
        '''


Your app will be live at the provided Firebase Hosting URL.
