# ShareScape
#### Share the world around you.

## About
ShareScape is a location-based image-sharing platform. The frameworks and tools used to build the application include MongoDB, AngularJS, ExpressJS, and Node.js, as well as Imgur’s image hosting API, and Google’s Geolocation API. Users will see their position represented by a unique marker and updated in real-time as they move. Surrounding them will be markers indicating pictures that have been uploaded by users in their vicinity. Users will be given the ability to upload existing photos with a title on their computer or mobile device, and see it appear on the map with a marker attached to the location where it was uploaded. In addition to this, the mobile and desktop versions of the application each have their own unique secondary upload feature. Desktops users will have the option to draw and upload an image, and mobile users will have the option to use the camera on their device to capture and upload a photo. Alongside creating and uploading content, users will be given the ability to upvote posts made by other users.

## Features
The initial goal for the application was to create a pleasant experience for users, in which they may interact with their communities in a visual medium in the simplest manner possible. That being the case, we chose to implement a model without user accounts. We believe that providing users with anonymity would allow them to freely express their creativity without being concerned about how they are perceived by other users. One of the fundamental principles of ShareScape is to make sure the content is local and relevant, so we decided to include a field on each post where the user’s distance from said post would be displayed. The goal here was to make the user feel engaged with their surroundings.

## Implementation
#### MEAN Stack
The choice of using MongoDB, ExpressJS, AngularJS, and Node.js, was mostly made based on our familiarity with it from the lessons taught throughout CPS 630, as well as on its relevance as a popularly used web stack.

Our first step in creating a database for our application was to decide what our objects and tables would look like. After considering what our application would need to do, we settled on creating a single collection that would store all the posts created by users. The objects in this collection would contain the following:
- An id, created by Mongo
- A post title
- A position, defined by a latitude and longitude
- An image link
- A rating score

Next, we had to host the database somewhere, as storing it locally would not be an option. We chose to use mLab. Once we created an account there, and set up the database, we set up the routing for our application to access mLab using Node.JS and Express.JS.

#### Google Geolocation API
Google Maps is by far the most widely known and trusted online mapping service today. As such, the choice of using Google’s Geolocation API for the map to be displayed in our application felt quite natural. It had all the features we needed, and had extensive documentation online that was much easier to understand as opposed to other existing Geolocation APIs, making it an easy choice to go with.

#### Imgur API
One of the challenges with creating an application that revolves around the sharing of images is thinking of an optimal solution to store or host the images. Storing the images in a database simply would not work, as that would quickly create a lot of overhead. Instead, we decided that we would host our images elsewhere, and reference those hosted images within our application. With this in mind, the first image hosting service we thought of was Imgur. Thankfully, Imgur possesses a relatively easy-to-use API, which we managed to integrate into our application seamlessly. 
