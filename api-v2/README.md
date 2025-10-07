# Sales Resolve API

API-ul pentru aplicația Sales Resolve.

## Funcționalități

- ✅ Autentificare cu JWT
- ✅ Gestionare utilizatori
- ✅ Sistem de mesaje
- ✅ Protecție admin
- ✅ Rate limiting
- ✅ Securitate cu Helmet

## Deployment

Acest API este gata pentru deployment pe Railway, Render, sau Heroku.

### Variabile de mediu

- `PORT` - Portul serverului (default: 4000)
- `JWT_SECRET` - Secretul pentru JWT (default: 'dev-secret-change-me')

### Comenzi

```bash
npm install
npm start
npm run dev  # pentru development
```

## Endpoints

- `POST /api/auth/register` - Înregistrare
- `POST /api/auth/login` - Login
- `POST /api/messages` - Trimite mesaj (public)
- `GET /api/messages` - Vezi mesaje (admin)
- `GET /api/health` - Health check
