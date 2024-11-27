import {api, getHeader} from "./axios"

export async function sendEmail(emailData) {
    try {
        // Gửi yêu cầu POST đến backend
        const response = await api.post('/email/send', emailData, {
            headers: getHeader()  // Nếu cần header, ví dụ cho authorization
        });

        if (response.status === 200) {
            console.log('Email sent successfully');
        } else {
            console.error('Failed to send email:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
}