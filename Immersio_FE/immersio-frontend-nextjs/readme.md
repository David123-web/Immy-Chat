## Set Up
Clone the repository from GitHub
In the root of the repository, run `yarn`. This will download the dependencies
Create a `.env` file in the root directory

```
NEXT_PUBLIC_BASE_API_URL=https://dev-api.immersio.io
NEXT_PUBLIC_REACT_APP_FACEBOOK_APP_ID=
NEXT_PUBLIC_REACT_APP_GOOGLE_APP_ID=
NEXT_PUBLIC_EXTERNAL_API_URL=https://openspeak.io/
NEXT_PUBLIC_EXTERNAL_API_URL2=http://dev.localhost:8080
NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY=
PORT=9090 
```


For `.env` secrets, please contact your team lead.

Start the server with `yarn dev` ( windows ) or `yarn dev:macos` ( macos )

In your browser, assuming you are set up to connect with our AWS dev environment (i.e., your `.env` is as above) connect to your local client with  `http://dev.localhost:9090/`

## Documents
- [GitHub Wiki](https://github.com/Winston-immersio/Immersio-WebApp-2023/wiki)
- [API Swagger UI](https://api.immersio.io/api)
- [API Document PDF](https://github.com/Winston-immersio/Immersio-WebApp-2023/blob/main/api-documentation.pdf)