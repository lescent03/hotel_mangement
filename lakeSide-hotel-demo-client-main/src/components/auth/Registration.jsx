import React, { useState } from "react"
import { registerUser } from "../utils/ApiFunctions"
import { Link } from "react-router-dom"
import User from "../../model/User"

const Registration = () => {
	const [registration, setRegistration] = useState(new User())

	const [errorMessage, setErrorMessage] = useState("")
	const [successMessage, setSuccessMessage] = useState("")

	const handleInputChange = (e) => {
		setRegistration({ ...registration, [e.target.name]: e.target.value })
	}

	const handleRegistration = async (e) => {
		e.preventDefault()
		try {
			const result = await registerUser(registration)
			setSuccessMessage(result)
			setErrorMessage("")
			setRegistration(new User())
		} catch (error) {
			setSuccessMessage("")
			setErrorMessage(`Registration error : ${error.message}`)
		}
		// Sau khi hoàn thành, cuộn lên đầu trang
		window.scrollTo({
			top: 0,
			behavior: 'smooth' // Tạo hiệu ứng cuộn mượt mà (tùy chọn)
		});
		setTimeout(() => {
			setErrorMessage("")
			setSuccessMessage("")
		}, 5000)
	}

	return (
		<section className="container col-6 mt-5 mb-5">
			{errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
			{successMessage && <p className="alert alert-success">{successMessage}</p>}

			<h2>Register</h2>
			<form onSubmit={handleRegistration}>
				<div className="mb-3 row">
					<label htmlFor="firstName" className="col-sm-2 col-form-label">
						first Name
					</label>
					<div className="col-sm-10">
						<input
							required
							id="firstName"
							name="firstName"
							type="text"
							className="form-control"
							value={registration?.firstName || ""}
							onChange={handleInputChange}
						/>
					</div>
				</div>

				<div className="mb-3 row">
					<label htmlFor="lastName" className="col-sm-2 col-form-label">
						Last Name
					</label>
					<div className="col-sm-10">
						<input
						 	required
							id="lastName"
							name="lastName"
							type="text"
							className="form-control"
							value={registration?.lastName || ""}
							onChange={handleInputChange}
						/>
					</div>
				</div>

				<div className="mb-3 row">
					<label htmlFor="email" className="col-sm-2 col-form-label">
						Email
					</label>
					<div className="col-sm-10">
						<input
							required
							id="email"
							name="email"
							type="email"
							className="form-control"
							value={registration?.email || ""}
							onChange={handleInputChange}
						/>
					</div>
				</div>

				<div className="mb-3 row">
					<label htmlFor="password" className="col-sm-2 col-form-label">
						Password
					</label>
					<div className="col-sm-10">
						<input
							required
							type="password"
							className="form-control"
							id="password"
							name="password"
							value={registration?.password || ""}
							onChange={handleInputChange}
						/>
					</div>
				</div>

				<div className="mb-3 row">
					<label htmlFor="idNumber" className="col-sm-2 col-form-label">
						CCCD
					</label>
					<div className="col-sm-10">
						<input
							required
							type="text"
							className="form-control"
							id="idNumber"
							name="idNumber"
							value={registration?.idNumber || ""}
							onChange={handleInputChange}
						/>
					</div>
				</div>
				<div className="mb-3">
					<button type="submit" className="btn btn-hotel" style={{ marginRight: "10px" }}>
						Register
					</button>
					<span style={{ marginLeft: "10px" }}>
						Already have an account? <Link to={"/login"}>Login</Link>
					</span>
				</div>
			</form>
		</section>
	)
}

export default Registration
