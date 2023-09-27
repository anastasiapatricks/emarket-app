import { ChangeEvent, FormEvent, useState } from "react"
import { Alert, Button, Container, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { RegisterReq } from "../models/UserReqResp"
import { newUserService } from "../services/UserService"

export const Register = () => {
    const navigate = useNavigate()
    const userService = newUserService()

    const [formData, setFormData] = useState<RegisterReq>({
        username: '',
        password: '',
        contactNo: '',
        email: '',
        name: '',
        role: 'USER'
    })
    const [errorMsg, setErrorMsg] = useState<string | null>(null)


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await userService.register(formData)
        } catch (error) {
            setErrorMsg((error as Error).message)
            throw error
        }
        navigate('/login', {
            state: {
                register: true
            }
        })
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <Container>
            <Form className="py-5 m-auto" style={{ width: "480px" }} onSubmit={handleSubmit}>
                <h1 className="mb-3">Register a new account</h1>
                {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="contactNo">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                        type="text"
                        name="contactNo"
                        value={formData.contactNo}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

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
                    Register
                </Button>
            </Form>
        </Container>
    )
}