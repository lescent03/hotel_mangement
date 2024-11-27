import {api, getHeader} from "./axios"

export async function CreateVNPayPayment(payment, paymentMethod) {
	try {
		console.log("dữ liệu để payment: ", payment, paymentMethod)
		const response = await api.post(`/payment/vnpay/create/${paymentMethod}/${payment}`)
        console.log("return payment: ", response)
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error booking room : ${error.message}`)
		}
	}
}

export async function CreateMomoPayment(payment, paymentMethod) {
	try {
		console.log("dữ liệu để payment: ", payment, paymentMethod)
		const response = await api.post(`/payment/momo/create/${paymentMethod}/${payment}`)
        console.log("return payment: ", response)
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error booking room : ${error.message}`)
		}
	}
}

export async function CreatePaypalPayment(payment, paymentMethod) {
	try {
		console.log("dữ liệu để payment: ", payment, paymentMethod)
		const response = await api.post(`/payment/paypal/create/${paymentMethod}/${payment}`)
        console.log("return payment: ", response)
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error booking room : ${error.message}`)
		}
	}
}

export async function PaypalSuccess(paymentId, payerId) {
    try {
        const response = await api.get(`/payment/success/${paymentId}/${payerId}`);
        console.log("return payment: ", response);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            console.error("Chi tiết lỗi từ server:", error.response.data); // Log chi tiết lỗi
            throw new Error(JSON.stringify(error.response.data)); // Chuyển thành chuỗi JSON
        } else {
            throw new Error(`Error booking room: ${error.message}`);
        }
    }
}