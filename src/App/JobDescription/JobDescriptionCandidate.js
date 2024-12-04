import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AddCandidateModal from '../AddCandidateDetails/AddCandiadteDetailsCandidatePage';
import api from '../../api/api';
import './JobDescription.css';

const JobListCandidate = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState(''); // 'success' or 'danger'

  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      showTimedAlert('Failed to load jobs. Please try again later.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const storedUserDetails = JSON.parse(localStorage.getItem('userDetails'));
    setUserDetails(storedUserDetails);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = jobs.filter((job) =>
      job.jobPostingName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const handleApplyJob = (job) => {
    setSelectedJob(job);
    setShowCandidateModal(true);
  };

  const handleCandidateAdded = () => {
    setShowCandidateModal(false);
    showTimedAlert('Thanks for applying! Your application was submitted successfully.', 'success');
  };

  const showTimedAlert = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);

    // Remove alert after 2 seconds
    setTimeout(() => {
      setAlertMessage('');
      setAlertVariant('');
    }, 2000);
  };

  if (!userDetails) {
    return <div>Loading user details...</div>;
  }

  return (
    <Container className="pt-5">
      <Row className="align-items-center mb-4">
        <Col xs={12} className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <h2 className="job-list-heading m-0">Job Details</h2>
          </div>
        </Col>
      </Row>

      {alertMessage && (
        <Row className="mb-3">
          <Col>
            <Alert variant={alertVariant} dismissible onClose={() => setAlertMessage('')}>
              {alertMessage}
            </Alert>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search jobs by title"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
      </Row>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center my-5" style={{ height: '300px' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row>
          {filteredJobs.map((job) => (
            <Col key={job.jobId} md={6} lg={4} className="mb-4">
              <Card className="job-card shadow-sm">
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    {job.jobPostingName}
                  </Card.Title>
                  <Card.Text>
                    <strong>Description:</strong> {job.description.substring(0, 100)}...
                    <br />
                    <strong>Salary:</strong> {job.salaryRange} <br />
                    <strong>Experience:</strong> {job.experienceRequired}
                  </Card.Text>
                  <Button
                    variant="success"
                    className="w-100"
                    onClick={() => handleApplyJob(job)}
                  >
                    Apply
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <AddCandidateModal
        show={showCandidateModal}
        onHide={() => setShowCandidateModal(false)}
        onAddCandidate={handleCandidateAdded}
        jobs={jobs}
        selectedJob={selectedJob}
      />
    </Container>
  );
};

export default JobListCandidate;
