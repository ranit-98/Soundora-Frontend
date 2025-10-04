import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { ENDPOINTS } from '@/api/endpoints';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  try {
    // Exchange authorization code for Google tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.NEXT_APP_FRONTEND_BASE_URL}/api/auth/callback`,
      grant_type: 'authorization_code',
      code,
    });


    const { id_token: idToken } = tokenResponse.data;
console.log(idToken,'idtoken');
    // Send ID token to Express backend
    const backendResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.authCallback}`,
      { token: idToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const { token, userId ,googleId,isAdmin} = backendResponse.data;
     console.log('Backend token:', backendResponse);

    // Set cookie and redirect
   res.setHeader("Set-Cookie", [
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Secure`,
      `userId=${userId}; Path=/; SameSite=Lax; Secure`,
      `googleId=${googleId}; Path=/; SameSite=Lax; Secure`,
      `isAdmin=${isAdmin}; Path=/; SameSite=Lax; Secure`,
    ]);
    res.redirect('/');


  } catch (error) {

    res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
}