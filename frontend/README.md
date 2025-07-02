# Uber Clone Frontend

This is the React.js frontend for the Uber Clone microservices project.

## Features
- Material UI, Ant Design, Bootstrap
- React Query, Apollo Client
- Real-time updates with Socket.IO
- Google Maps/Leaflet integration
- Formik + Yup for forms
- Framer Motion for animations
- Lazy loading and code splitting
- Error boundaries
- SEO support (React Helmet)
- Mobile-first responsive layout

## Getting Started

```bash
npm install
npm start
```

## Environment Variables
- `REACT_APP_API_GATEWAY_URL` (e.g. http://localhost:8080)

## Project Structure
- `src/pages/` — Main pages (Home, Booking, Driver, Payment, Notification)
- `src/components/` — Shared and lazy-loaded components

## Docker
This app is dockerized and can be run with the full stack using `docker-compose` from the project root.

## License
MIT
