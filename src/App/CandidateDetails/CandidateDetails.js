import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card, Spinner } from 'react-bootstrap';
import { FaEdit, FaArrowLeft, FaPlus, FaTrash, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AddCandidateModal from '../AddCandidateDetails/AddCandidateDetails';
import api from '../../api/api';
import './CandidateDetails.css';

const CandidateDetailsPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [candidateToEdit, setCandidateToEdit] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(6);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobsAndCandidates = async () => {
      setLoading(true);
      try {
        const jobResponse = await api.get('/jobs');
        setJobs(jobResponse.data);

        const candidateResponse = await api.get('/candidates');
        setCandidates(candidateResponse.data);
        setFilteredCandidates(candidateResponse.data);
      } catch (error) {
        console.error('Error fetching jobs or candidates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndCandidates();

    const storedUserDetails = JSON.parse(localStorage.getItem('userDetails'));
    setUserDetails(storedUserDetails);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = candidates.filter((candidate) =>
      `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(value)
    );
    setFilteredCandidates(filtered);
  };

  const handleAddCandidate = (newCandidate) => {
    setCandidates((prev) => [...prev, newCandidate]);
    setFilteredCandidates((prev) => [...prev, newCandidate]);
  };

  const handleEditCandidate = (updatedCandidate) => {
    const updated = candidates.map((candidate) =>
      candidate.candidateId === updatedCandidate.candidateId ? updatedCandidate : candidate
    );
    setCandidates(updated);
    setFilteredCandidates(updated);
  };

  const handleEditClick = (candidate) => {
    setEditMode(true);
    setCandidateToEdit(candidate);
    setShowAddModal(true);
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await api.delete(`/candidates/${candidateId}`);
        const updatedCandidates = candidates.filter((candidate) => candidate.candidateId !== candidateId);
        setCandidates(updatedCandidates);
        setFilteredCandidates(updatedCandidates);
      } catch (error) {
        console.error('Error deleting candidate:', error);
        alert('Failed to delete candidate.');
      }
    }
  };

  const getChipClass = (stage) => {
    switch (stage?.toLowerCase()) {
      case 'shortlisted':
        return 'bg-success text-white';
      case 'in process':
        return 'bg-warning text-dark';
      case 'scheduled':
        return 'bg-primary text-white';
      case 'selected':
        return 'bg-info text-white';
      case 'rejected':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  // Pagination logic
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = filteredCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="pt-5">
      <Row className="align-items-center mb-4">
        <Col xs={12} className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Button
              variant="link"
              onClick={() => navigate(-1)}
              className="p-0 me-2"
              style={{ textDecoration: 'none', color: '#007bff' }}
            >
              <FaArrowLeft />
            </Button>
            <h2 className="candidate-list-heading m-0">Candidate Details</h2>
          </div>
          {userDetails?.role !== 'employee' && (
            <Button
              variant="primary"
              onClick={() => {
                setEditMode(false);
                setCandidateToEdit(null);
                setShowAddModal(true);
              }}
            >
              <FaPlus /> Add Candidate
            </Button>
          )}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search candidates by name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Row>
            {currentCandidates.map((candidate) => (
              <Col key={candidate.candidateId} md={6} lg={4} className="mb-4">
                <Card className="candidate-card shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <Card.Title>
                          {candidate.firstName} {candidate.lastName}
                        </Card.Title>
                        <span className={`candidate-chip badge ${getChipClass(candidate.stage)}`}>
                          {candidate.stage || 'In Process'}
                        </span>
                      </div>
                      {userDetails?.role !== 'employee' && (
                        <div>
                          <Button
                            variant="link"
                            className="me-2 text-primary"
                            onClick={() => handleEditClick(candidate)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="link"
                            className="text-danger"
                            onClick={() => handleDeleteCandidate(candidate.candidateId)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      )}
                    </div>
                    <Card.Text>
                      <strong>Mobile:</strong> {candidate.mobileNo} <br />
                      <strong>Email:</strong> {candidate.email} <br />
                      <strong>Job:</strong>{' '}
                      {jobs.find((job) => job.jobId === candidate.jobId)?.jobPostingName || 'N/A'}
                    </Card.Text>
                    <a
                      href={`https://backendpro-4-xu1g.onrender.com/${candidate.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm"
                    >
                      <FaDownload />Downlaod
                    </a>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <nav aria-label="Pagination" className="pagination-container fixed-bottom">
            <ul className="pagination justify-content-end pe-3">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <Button
                  className="page-link"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &laquo;
                </Button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <Button className="page-link" onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </Button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <Button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &raquo;
                </Button>
              </li>
            </ul>
          </nav>
        </>
      )}

      {userDetails?.role !== 'employee' && (
        <AddCandidateModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          onAddCandidate={handleAddCandidate}
          onEditCandidate={handleEditCandidate}
          editMode={editMode}
          candidateToEdit={candidateToEdit}
          jobs={jobs}
        />
      )}
    </Container>
  );
};

export default CandidateDetailsPage;
