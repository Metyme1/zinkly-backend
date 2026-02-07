import axios from 'axios';

const ZOOM_BASE_URL = 'https://api.zoom.us/v2';
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID!;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;

async function getAccessToken() {
  const tokenResponse = await axios.post(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
    {},
    {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString(
            'base64'
          ),
      },
    }
  );

  return tokenResponse.data.access_token;
}

export const ZoomService = {
  async createMeeting(
    hostName: string,
    topic: string,
    date: string,
    time: string
  ) {
    const accessToken = await getAccessToken();

    const start_time = `${date}T${time}:00Z`; // ISO string

    const response = await axios.post(
      `${ZOOM_BASE_URL}/users/me/meetings`,
      {
        topic,
        type: 2, // scheduled
        start_time,
        duration: 60,
        settings: {
          join_before_host: false,
          approval_type: 0,
          meeting_authentication: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      joinUrl: response.data.join_url,
      startUrl: response.data.start_url,
    };
  },
};
