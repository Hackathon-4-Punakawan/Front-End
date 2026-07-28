const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export async function suggestCpmkApi(aktivitasText) {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/suggest-cpmk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ aktivitas: aktivitasText }),
    });

    const result = await response.json();
    if (response.ok) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.error || result.message || 'Gagal menganalisis AI' };
  } catch (err) {
    console.error('AI suggest error:', err);
    return { success: false, message: 'Gagal terhubung ke AI Service backend' };
  }
}
