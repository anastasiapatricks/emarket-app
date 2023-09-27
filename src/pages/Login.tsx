import { ChangeEvent, FormEvent, useState } from "react"
import { Alert, Button, Container, Form } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import { useUserAuth } from "../hooks/useUserAuth"
import { LoginReq } from "../models/UserReqResp"

export const Login = () => {
    const { login } = useUserAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const [formData, setFormData] = useState<LoginReq>({
        username: '',
        password: ''
    })
    const [errorMsg, setErrorMsg] = useState<string | null>(null)


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await login(formData)
        } catch (error) {
            setErrorMsg((error as Error).message)
            throw error
        }
        navigate('/')
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrorMsg(null)
    };

    return (
        <Container>
            <Form className="py-5 m-auto" style={{ width: "480px" }} onSubmit={handleSubmit}>
                <h1 className="mb-3">Login to your account</h1>
                {location.state?.register && <Alert variant="success" dismissible>Account registered successfully!</Alert>}
                {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </Container>
    )
}
