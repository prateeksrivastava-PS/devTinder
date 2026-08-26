# DevTinder APIs

auth router
- POST /auth/signup
- POST /auth/login
- POST/auth/logout

profile router
- GET    /profile/view
- PATCH  /profile/edit
- PATCH  /profile/password


connectionRequestRouter
- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestedId
- POST /request/review/rejected/:requestedId

userRouter
- GET/requests/received
- GET/user/connections
- GET/feed -Gets you the profiles of other user on plateforms 
-