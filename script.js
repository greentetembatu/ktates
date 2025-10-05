// URL Web App Apps Script Anda yang sudah benar
const webAppUrl = 'https://script.google.com/macros/s/AKfycbxp-KepQaGoJhhEdLG9Q-w7lUod-3Pwm8oKvT-AtV9k8UL5CA6Z_iqzXv6gcNrmOfKK6w/exec'; 

document.getElementById('ktaForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah halaman reload
    
    const nomorKTA = document.getElementById('nomorKTA').value.trim();
    const messageElement = document.getElementById('message');
    const previewArea = document.getElementById('previewArea');
    const searchButton = document.getElementById('searchButton');

    // 1. Reset tampilan dan tampilkan loading
    messageElement.textContent = 'Mencari data KTA dan membuat dokumen...';
    messageElement.style.color = '#007bff';
    previewArea.style.display = 'none';
    searchButton.disabled = true; // Nonaktifkan tombol saat memproses

    // Buat objek FormData untuk mengirim data sebagai formulir
    const formData = new FormData();
    formData.append('kta', nomorKTA); // Menambahkan Nomor KTA ke FormData

    // 2. Kirim permintaan POST ke Google Apps Script (Web App)
    fetch(webAppUrl, {
        method: 'POST',
        // PENTING: Jangan set header 'Content-Type' saat menggunakan FormData!
        body: formData 
    })
    .then(response => {
        // Cek status respons
        if (!response.ok) {
            // Tangani error HTTP seperti 404, 500, dll.
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // 3. Tangani respons dari Apps Script
        if (data.status === 'success') {
            
            messageElement.textContent = 'KTA ditemukan! Silakan lihat pratinjau dan unduh.';
            messageElement.style.color = '#28a745';

            // Menampilkan pratinjau dan link download
            const pdfUrl = data.pdfUrl; 
            const ktaName = data.namaAnggota || 'KTA';
            
            // Set sumber untuk pratinjau (iframe)
            document.getElementById('pdfPreview').src = pdfUrl;
            
            // Set link dan nama file untuk download
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = pdfUrl;
            downloadLink.download = `${ktaName}_${nomorKTA}.pdf`; // Nama file download yang lebih baik
            
            // Tampilkan area pratinjau
            previewArea.style.display = 'block';

        } else {
            // Data.status adalah 'error' (misal: KTA tidak ditemukan)
            messageElement.textContent = `Pencarian Gagal: ${data.message}`;
            messageElement.style.color = '#dc3545';
        }
    })
    .catch(error => {
        // 4. Tangani error jaringan atau skrip
        console.error('Error Komunikasi:', error);
        messageElement.textContent = `Terjadi kesalahan saat berkomunikasi: ${error.message}. Periksa Apps Script log.`;
        messageElement.style.color = '#dc3545';
    })
    .finally(() => {
        // 5. Pastikan tombol kembali diaktifkan
        searchButton.disabled = false;
    });
});