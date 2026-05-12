document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedback-form');
    const statusDiv = document.getElementById('fb-status');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('.btn-submit');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang gửi...';

            const data = {
                name: document.getElementById('fb-name').value.trim(),
                email: document.getElementById('fb-email').value.trim(),
                subject: document.getElementById('fb-subject').value.trim(),
                message: document.getElementById('fb-message').value.trim()
            };

            try {
                // Call real endpoint in server.js
                const res = await fetch('http://localhost:3000/api/feedbacks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if(res.ok) {
                    statusDiv.textContent = '✅ Đã gửi phản hồi thành công! Cảm ơn bạn.';
                    statusDiv.className = 'status-msg success';
                    form.reset();
                } else {
                    throw new Error('Lỗi server');
                }
            } catch(err) {
                statusDiv.textContent = '❌ Có lỗi xảy ra, không thể gửi phản hồi lúc này.';
                statusDiv.className = 'status-msg error';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Gửi Phản Hồi';
            }
        });
    }
});
