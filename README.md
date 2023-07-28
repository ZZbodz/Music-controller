## Music-controller: Collaborative Music Room Django Application

Music-controller is a Django web application that facilitates the creation of collaborative music rooms. The application comprises three Django apps: "frontend," "api," and "spotify." Each app serves a specific purpose to deliver a seamless music-sharing experience.

### Features:

- **Frontend App (React Integration):** The "frontend" Django app is initialized as a React app, providing users with an interactive and responsive user interface. The integration of React enhances the overall user experience, making navigation and interaction smooth and efficient.

- **Spotify App (Spotify API Integration):** The "spotify" Django app handles all Spotify API interactions, storing credentials and requirements to fetch data from the actual Spotify API. By leveraging the Spotify API, users can seamlessly access music libraries and playlists, ensuring a wide range of music choices.

- **API App (Data Handling):** The "api" Django app acts as a bridge between the frontend and backend, handling all API requests made by the React frontend. Using appropriate models and configurations, the API app efficiently fetches and sends data to the frontend, enabling users to interact with the music rooms effectively.

### Main Functionality:

The primary purpose of Music-controller is to allow users to create and join music rooms, where participants can collaboratively manage music playback. Room owners have control over settings like the number of votes required to skip a song, thereby ensuring a democratic and enjoyable music-sharing experience.

### How to Run:

1. Visit [Spotify Developer Dashboard](https://developer.spotify.com/) and create a new app to obtain your Spotify API credentials. Set your own Spotify API credentials and requirements in `spotify/Credentials.py` to enable seamless access to the Spotify API.

2. Run the following command to start the Django development server: `python manage.py runserver`

With Music-controller, users can host music rooms, collaborate on music choices, and create a fun and engaging musical environment.
