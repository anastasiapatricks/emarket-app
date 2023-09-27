import { Container } from "react-bootstrap"
import { useUserAuth } from "../hooks/useUserAuth"

export const Home = () => {
    const { user } = useUserAuth()

    if (!user) {
        return <Container>
            Not logged in
        </Container>
    }

    return <Container>
        <p>user.id: {user.id}</p>
        <p>user.username: {user?.username}</p>
        <p>user.name: {user?.name}</p>
        <p>user.email: {user?.email}</p>
        <p>user.contactNo: {user.contactNo}</p>
        <p>user.role: {user?.role}</p>
    </Container>
}