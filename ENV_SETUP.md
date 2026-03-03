# Environment Variables for Mission Control

## Required for Vercel Deployment

### Database
```
DATABASE_URL=postgresql://...
```

### NextAuth (Google OAuth)
```
NEXTAUTH_URL=https://missioncontrol-inky.vercel.app
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
```

## Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create or select a project
3. Go to APIs & Services > Credentials
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Application type: Web application
6. Add authorized redirect URIs:
   - `https://missioncontrol-inky.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for local dev)
7. Copy the Client ID and Client Secret to your environment variables

## Notes
- Only @municibid.com email addresses can sign in
- The `/api/tasks` and `/api/activity` endpoints are publicly accessible (for heartbeat integration)
- All other routes require authentication
