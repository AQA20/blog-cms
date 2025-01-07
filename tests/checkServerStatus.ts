import envConfig from '@/envConfig';
import { HTTP_STATUS_OK } from '@/lib/constants';

const { API_URL } = envConfig;

export const checkServerStatus = async () => {
  try {
    const res = await fetch(`${API_URL}/articles`, { method: 'HEAD' });
    if (!res.ok || res.status !== HTTP_STATUS_OK) {
      throw new Error(
        `Server is not reachable at ${API_URL}/articles. Status: ${res.status}`,
      );
    }
  } catch (error: any) {
    if (error.cause?.code === 'ECONNREFUSED') {
      throw new Error(
        'Connection refused: Unable to reach the server. Ensure it is running and accessible',
      );
    }
    throw error;
  }
};
