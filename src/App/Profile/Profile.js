import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const Profile = () => {
    const [userDetails, setUserDetails] = useState({});
    const [editableDetails, setEditableDetails] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userDetails"));
        if (user) {
            setUserDetails(user);
            setEditableDetails(user);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await api.put("/user/edit", editableDetails);

            // Fetch updated user details using email
            const updatedUserDetails = await api.get(`/user/details?email=${editableDetails.email}`);
            setUserDetails(updatedUserDetails.data);
            localStorage.setItem("userDetails", JSON.stringify(updatedUserDetails.data));

            setAlertMessage("Profile updated successfully!");
            setAlertVariant("success");
            setIsEditing(false);

            // Redirect to the home page after 1 second
            setTimeout(() => {
                navigate("/layout");
            }, 1000);
        } catch (error) {
            setAlertMessage("Failed to update profile. Please try again.");
            setAlertVariant("danger");
        }
    };

    return (
        <Container className="pt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <Card>
                        <Card.Body>
                            <h3 className="text-center">Your Profile</h3>
                            {alertMessage && <Alert variant={alertVariant}>{alertMessage}</Alert>}
                            <Form>
                                <Form.Group controlId="fullName" className="mb-3">
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fullName"
                                        value={editableDetails.fullName || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </Form.Group>

                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={editableDetails.email || ''}
                                        onChange={handleInputChange}
                                        disabled
                                    />
                                </Form.Group>

                                <Form.Group controlId="role" className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="role"
                                        value={editableDetails.role || ''}
                                        onChange={handleInputChange}
                                        disabled
                                    />
                                </Form.Group>

                                {isEditing ? (
                                    <div className="d-flex justify-content-between">
                                        <Button variant="primary" onClick={handleSave}>
                                            Save
                                        </Button>
                                        <Button variant="secondary" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="primary" onClick={() => setIsEditing(true)}>
                                        Edit Profile
                                    </Button>
                                )}
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
