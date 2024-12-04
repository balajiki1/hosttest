import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import api from '../../api/api';

const AddCandidateModalforCandidate = ({
  show,
  onHide,
  onAddCandidate,
  selectedJob,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState(''); // 'success' or 'danger'

  // Reset fields when modal opens
  useEffect(() => {
    if (show) {
      resetForm();
    }
  }, [show]);

  // Reset form fields
  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setMobileNo('');
    setEmail('');
    setResume(null);
    setAlertMessage('');
    setAlertVariant('');
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that all fields are filled
    if (!firstName || !lastName || !mobileNo || !email || !resume) {
      setAlertMessage('All fields are required, including the resume.');
      setAlertVariant('danger');
      return;
    }

    setLoading(true);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('mobileNo', mobileNo);
    formData.append('email', email);
    formData.append('jobId', selectedJob?.jobId); // Ensure jobId exists
    formData.append('stage', 'In Process'); // Set stage to "In Process"
    formData.append('resume', resume);

    try {
      const response = await api.post('/candidates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setAlertMessage('Application submitted successfully!');
        setAlertVariant('success');
        onAddCandidate(response.data.candidate);
        resetForm();
        setTimeout(() => onHide(), 2000); // Close modal after success
      } else {
        setAlertMessage('Failed to submit the application. Please try again.');
        setAlertVariant('danger');
      }
    } catch (error) {
      console.error('Error submitting candidate:', error);
      setAlertMessage(
        error.response?.data?.message || 'An error occurred while submitting the application.'
      );
      setAlertVariant('danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Apply for {selectedJob?.jobPostingName || 'this job'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alertMessage && (
          <Alert variant={alertVariant} onClose={() => setAlertMessage('')} dismissible>
            {alertMessage}
          </Alert>
        )}
        {loading ? (
          <div className="text-center my-3">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="mobileNo">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter mobile number"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="resume">
              <Form.Label>Resume</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setResume(e.target.files[0])}
                required
              />
            </Form.Group>
            <div className="text-end">
              <Button variant="primary" type="submit">
                Submit Application
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AddCandidateModalforCandidate;
