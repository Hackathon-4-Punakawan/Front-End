const API_BASE_URL = 'http://localhost:3001/api/v1';

export async function uploadPdfFileApi(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('edushift_token');

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error in uploadPdfFileApi:', error);
    return {
      success: false,
      message: error.message || 'Gagal terhubung ke server upload.'
    };
  }
}
