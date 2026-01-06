# Google Maps API Setup Instructions

## Step 1: Get Your Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Go to "Credentials" and create a new API key
5. Restrict the API key to your domain for security

## Step 2: Add API Key to Your Project

Create a file called `.env.local` in the root of your project (`/eonmeds-intake/medical-intake/`) and add:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with your actual Google Maps API key.

## Step 3: Restart Your Development Server

After adding the environment variable, restart your Next.js development server:

```bash
npm run dev
```

## Security Note

- Never commit your `.env.local` file to version control
- Add `.env.local` to your `.gitignore` file
- For production, add the API key to your Vercel environment variables

## Testing

Once configured, the address page at `/intake/address` should:
- Show a Google Map
- Provide address autocomplete suggestions
- Update the map marker when an address is selected
