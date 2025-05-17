import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function uploadPodcast(file, title, description) {
  // Get presigned URL
  const { data: { url, fields } } = await api.post('/presign', {
    fileName: file.name,
    fileType: file.type,
  });

  // Upload to S3
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append('file', file);

  await axios.post(url, formData);

  // Save metadata to DynamoDB
  const s3Url = `${url}/${fields.key}`;
  return api.post('/podcast', {
    title,
    description,
    audioUrl: s3Url,
  });
}

export async function getPodcasts() {
  const { data } = await api.get('/podcast');
  return data;
}

export async function getPodcast(id) {
  const { data } = await api.get(`/podcast/${id}`);
  return data;
}

export default api; 