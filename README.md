# README

This is the url linked to the website:

https://appweb-1e486.firebaseapp.com/

If you encounter grpc errors after running npm install, please try to downgrade your node.js version as installing firebase may not work for the newest node version. You can try those commands:

sudo npm cache clean -f

sudo npm install -g n

sudo n 10.13.0

npm install firebase

There are mainly two new features assoicated with small functions:

- Real Time Update


    All our pages are updated in real time


    - Moment Page

        Whenever a new moment is posted or comments are updated, user can see it without refreshing the page.

    - Friend Page

        - Friend Request
            
            Whenever user receives a new friend request, user can see it without refreshing the page.

        - Chat with Friend

            User can chat with his friend without refreshing the page to see the new message sent from friends.

    - At Page

          Whenever user receives a new at, user can see it without refreshing the page.

- Notification on Navigation Bar

    If user receives new friend requests or new messages and user is not in friend page, or receives a new @ and is not in @ page, he or she will be able to see a notification which is associated with a number on navigation bar. If user enters the friend page or @ page, the notifaction will be cleared and re-counted.

- Display Users' Moments
    
    In user's profile page, the user's all posted moments are listed.

- Some Small Features

    User can search another user by email. 
    User is able to click on anyone's name to go to that user's profile and send friend request.
    If friend request is sent or that user is a friend, user will see a corresponding message instead of the send friend request button.
