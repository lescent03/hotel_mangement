import React, { createContext, useState, useContext } from "react"
import jwt_decode from "jwt-decode"

export const AuthContext = createContext({
	user: null,
	handleLogin: (token) => {},
	handleLogout: () => {}
})

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)

	const handleLogin = (token) => {
		const decodedUser = jwt_decode(token)
		console.log(decodedUser)
		localStorage.setItem("userId", decodedUser.sub)
		console.log(localStorage.getItem("userId"))
		localStorage.setItem("userRole", decodedUser.roles)
		console.log(localStorage.getItem("userRole"))
		localStorage.setItem("token", token)
		console.log(localStorage.getItem("token"))
		setUser(decodedUser)
	}

	const handleLogout = () => {
		localStorage.removeItem("userId")
		localStorage.removeItem("userRole")
		localStorage.removeItem("token")
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
}

