import axios from 'axios';

// Membuat instance axios dengan konfigurasi dasar
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Interceptor untuk menambahkan token otorisasi ke setiap request
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// --- FUNGSI OTENTIKASI & PROFIL ---
export const login = (credentials) => apiClient.post('/login', credentials);
export const getUser = () => apiClient.get('/v1/user');
export const updateProfileInfo = (profileData) => apiClient.put('/v1/user/profile', profileData);
export const updatePassword = (passwordData) => apiClient.put('/v1/user/password', passwordData);
export const uploadProfilePhoto = (photoFile) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    return apiClient.post('/v1/user/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};


// --- FUNGSI MANAJEMEN PENGGUNA (ADMIN) ---

/**
 * Mengambil daftar pengguna. Cerdas: bisa dengan atau tanpa paginasi.
 * @param {number|null} page - Nomor halaman untuk paginasi. Jika null, mengambil semua pengguna 'employee' (untuk filter).
 * @returns {Promise}
 */
export const getUsers = (params = {}) => {
    // Menggunakan URLSearchParams untuk membuat query string dari objek
    const query = new URLSearchParams(params).toString();
    const url = `/v1/users?${query}`;
    return apiClient.get(url);
};

export const createUser = (userData) => apiClient.post('/v1/users', userData);
export const updateUser = (id, userData) => apiClient.put(`/v1/users/${id}`, userData);
export const deleteUser = (id) => apiClient.delete(`/v1/users/${id}`);


// --- FUNGSI TUGAS ---
export const getTasks = (params) => apiClient.get('/v1/tasks', { params });
export const getTask = (id) => apiClient.get(`/v1/tasks/${id}`);
export const createTask = (taskData) => apiClient.post('/v1/tasks', taskData);
export const updateTask = (id, taskData) => apiClient.put(`/v1/tasks/${id}`, taskData);
export const deleteTask = (id) => apiClient.delete(`/v1/tasks/${id}`);
export const getTaskActivities = (taskId) => apiClient.get(`/v1/tasks/${taskId}/activities`);
export const postTaskUpdate = (taskId, data) => apiClient.post(`/v1/tasks/${taskId}/updates`, data);


// --- FUNGSI LAMPIRAN (ATTACHMENTS) ---
export const uploadAttachment = (taskId, file) => {
    const formData = new FormData();
    formData.append('attachment_type', file.type.startsWith('image/') ? 'image' : 'file');
    formData.append('file', file);
    return apiClient.post(`/v1/tasks/${taskId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
export const addLinkAttachment = (taskId, url) => {
    return apiClient.post(`/v1/tasks/${taskId}/attachments`, {
        attachment_type: 'link',
        url: url,
    });
};
export const deleteAttachment = (attachmentId) => {
    return apiClient.delete(`/v1/attachments/${attachmentId}`);
};


// --- FUNGSI KOMENTAR ---
export const getTaskComments = (taskId) => {
    return apiClient.get(`/v1/tasks/${taskId}/comments`);
};
export const postTaskComment = (taskId, commentData) => {
    return apiClient.post(`/v1/tasks/${taskId}/comments`, commentData);
};

// --- FUNGSI BARU UNTUK JURNAL KALENDER ---
/**
 * Mengambil data ringkasan (mood & jumlah catatan) untuk satu bulan penuh.
 * @param {number} year - Tahun, misal: 2025
 * @param {number} month - Bulan, misal: 7 untuk Juli (1-12)
 */
export const getJournalMonthData = (year, month) => apiClient.get(`/v1/journals/month/${year}/${month}`);

/**
 * Mengambil detail lengkap (mood & daftar catatan) untuk satu tanggal.
 * @param {string} date - Tanggal dalam format YYYY-MM-DD.
 */
export const getJournalDayDetails = (date) => apiClient.get(`/v1/journals/day/${date}`);

/**
 * Memperbarui mood untuk tanggal tertentu.
 * @param {object} data - Data berisi { entry_date, mood }
 */
export const updateJournalMood = (data) => apiClient.post('/v1/journals/mood', data);

/**
 * Menambahkan catatan baru ke tanggal tertentu.
 * @param {object} data - Data berisi { entry_date, content }
 */
export const addJournalNote = (data) => apiClient.post('/v1/journals/notes', data);

/**
 * Memperbarui konten catatan yang sudah ada.
 * @param {number} noteId - ID dari catatan yang akan diubah.
 * @param {object} data - Data berisi { content }
 */
export const updateJournalNote = (noteId, data) => apiClient.put(`/v1/journals/notes/${noteId}`, data);

/**
 * Menghapus catatan.
 * @param {number} noteId - ID dari catatan yang akan dihapus.
 */
export const deleteJournalNote = (noteId) => apiClient.delete(`/v1/journals/notes/${noteId}`);


//statistic 
export const getStatistics = (params) => apiClient.get('/v1/statistics', { params });
