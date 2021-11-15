import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../Actions/userAction'

const RegisterScreen = ({ history, location }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [position, setPosition] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch()
    const usersReducer = useSelector((state) => state.usersReducer)
    const { loading, error } = usersReducer




    useEffect(() => {

    }, [])

    const submitHandler = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setMessage('password do not match')
        } else {
            dispatch(register(firstName, lastName, phoneNumber, position, email, password))
        }

    }

    return (
        <Container>
            <Row className='justify-content-md-center py-5'>
                <Col xs={12} md={6}>
                    <h1>Sign In</h1>

                    {message && <h1 style={{ color: 'red' }}>{message}</h1>}
                    {error && <h1 style={{ color: 'red' }}>{error}</h1>}
                    {loading && <h1>Loading... </h1>}
                    <Form onSubmit={submitHandler}>


                        <Form.Group controlId='text'>
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                                type='name'
                                placeholder='Enter first name'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='text'>
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                                type='name'
                                placeholder='Enter last name'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>


                        <Form.Group controlId='text'>
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type='name'
                                placeholder='Enter Phone number'
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='text'>
                            <Form.Label>Position</Form.Label>
                            <Form.Control
                                type='name'
                                placeholder='Enter position'
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='Password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            >

                            </Form.Control>

                        </Form.Group>


                        <Form.Group controlId='Password'>
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Confirm password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            >

                            </Form.Control>

                        </Form.Group>

                        <Button type='Submit' variant='dark' className='mt-3'> Sign In</Button>

                    </Form>


                </Col>
            </Row>

        </Container>
    )
}

export default RegisterScreen