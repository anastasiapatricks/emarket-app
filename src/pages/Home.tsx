import { Container } from "react-bootstrap"
import { useUserAuth } from "../hooks/useUserAuth"
import './Home.css'

export const Home = () => {
    const { user } = useUserAuth()

    if (!user) {
        return <Container>
            Not logged in
        </Container>
    }

    return <Container>
        <div className="user-profile">
            <h1>User Profile</h1>
            <div className="user-info">
                <img
                    src="holder.js/100px180" // Add a profile picture here
                    className="user-avatar"
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src="https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
                    }}
                />
                <table className="user-table">
                    <tbody>
                    <tr>
                        <td><strong>User ID:</strong></td>
                        <td>{user.id}</td>
                    </tr>
                    <tr>
                        <td><strong>Username:</strong></td>
                        <td>{user.username}</td>
                    </tr>
                    <tr>
                        <td><strong>Name:</strong></td>
                        <td>{user.name}</td>
                    </tr>
                    <tr>
                        <td><strong>Email:</strong></td>
                        <td>{user.email}</td>
                    </tr>
                    <tr>
                        <td><strong>Contact Number:</strong></td>
                        <td>{user.contactNo}</td>
                    </tr>
                    <tr>
                        <td><strong>Role:</strong></td>
                        <td>{user.role}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </Container>
}