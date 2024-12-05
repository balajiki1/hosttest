import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import logo from '../../assets/e - Recruiter new.svg';
import './signup.css';

const SignupCandidate = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOTP] = useState('');
  const [otpRecord, setOtpRecord] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear specific error on change
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const { fullName, email, password, confirmPassword } = formData;
    let formErrors = {};
    let isValid = true;

    if (!fullName) {
      isValid = false;
      formErrors.fullName = 'User name is required.';
    }

    if (!email) {
      isValid = false;
      formErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      isValid = false;
      formErrors.email = 'Invalid email address.';
    }

    if (!password) {
      isValid = false;
      formErrors.password = 'Password is required.';
    } else if (!validatePassword(password)) {
      isValid = false;
      formErrors.password =
        'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character (!@#$%^&*).';
    }

    if (!confirmPassword) {
      isValid = false;
      formErrors.confirmPassword = 'Confirm password is required.';
    } else if (confirmPassword !== password) {
      isValid = false;
      formErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    const { fullName, email, password } = formData;

    try {
      const response = await api.post('/user/create-candidate', {
        fullName,
        email,
        password,
      });
      setOtpRecord(response.data.otpRecord);
      setShowOTPModal(true);
      setAlertMessage('OTP sent to your email. Please verify to complete signup.');
      setAlertVariant('info');
    } catch (error) {
      setAlertMessage(error.response?.data?.message || 'Signup failed');
      setAlertVariant('danger');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const otpPayload = { otpRecord, otp: String(otp) };
      await api.post('/user/verify-otp', otpPayload);
      setAlertMessage('Signup successful! Redirecting to login...');
      setAlertVariant('success');
      setTimeout(() => {
        window.location.href = '/'; // Redirect to login page
      }, 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || 'OTP verification failed');
      setAlertVariant('danger');
    }
  };

  return (
    <Container fluid className="signup-page d-flex align-items-center justify-content-center">
      <Row className="justify-content-center w-100">
        <Col xs={11} sm={10} md={8} lg={6} xl={5}>
          <div className="text-center mb-4">
            <img src={logo} alt="Logo" className="signup-logo" />
          </div>

          {alertMessage && (
            <Alert variant={alertVariant} className="text-center">
              {alertMessage}
            </Alert>
          )}

          <Card className="signup-card">
            <Card.Body>
              <h2 className="text-center mb-4">Candidate Signup</h2>
              <Form noValidate>
                <Form.Group controlId="fullName" className="mb-3">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    isInvalid={!!errors.fullName}
                    placeholder="Enter your user name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                    placeholder="Enter your email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    isInvalid={!!errors.password}
                    placeholder="Enter a strong password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    isInvalid={!!errors.confirmPassword}
                    placeholder="Re-enter your password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button type="button" variant="primary" className="w-100" onClick={handleSignup}>
                  Sign Up
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p>
                  Already have an account?{' '}
                  <Link to="/" className="login-link">Login</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showOTPModal} onHide={() => setShowOTPModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verify OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="otp">
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              placeholder="Enter OTP sent to your email"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleVerifyOTP}>
            Verify
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SignupCandidate;
