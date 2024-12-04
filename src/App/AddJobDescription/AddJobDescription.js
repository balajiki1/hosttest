import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../api/api';

const AddJobModal = ({ show, onHide, onAddJob, onEditJob, editMode, jobToEdit }) => {
  const [jobPostingName, setJobPostingName] = useState('');
  const [description, setDescription] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [experienceRequired, setExperienceRequired] = useState('');

  useEffect(() => {
    if (editMode && jobToEdit) {
      setJobPostingName(jobToEdit.jobPostingName);
      setDescription(jobToEdit.description);
      setSalaryRange(jobToEdit.salaryRange);
      setExperienceRequired(jobToEdit.experienceRequired);
    } else {
      setJobPostingName('');
      setDescription('');
      setSalaryRange('');
      setExperienceRequired('');
    }
  }, [editMode, jobToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (jobPostingName && description && salaryRange && experienceRequired) {
      const jobData = {
        jobId: jobToEdit?.jobId, // Ensure jobId is preserved for editing
        jobPostingName,
        description,
        salaryRange,
        experienceRequired,
      };

      try {
        if (editMode) {
          await api.put(`/jobs/${jobToEdit.jobId}`, jobData);
          onEditJob();
        } else {
          await api.post('/jobs/create', jobData);
          onAddJob();
        }
        onHide();
      } catch (error) {
        console.error('Error saving job', error);
        alert('Failed to save job');
      }
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editMode ? 'Edit Job' : 'Add Job'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="jobPostingName">
            <Form.Label>Job Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter job title"
              value={jobPostingName}
              onChange={(e) => setJobPostingName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="salaryRange">
            <Form.Label>Salary Range</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter salary range"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="experienceRequired">
            <Form.Label>Experience Required</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter experience required"
              value={experienceRequired}
              onChange={(e) => setExperienceRequired(e.target.value)}
            />
          </Form.Group>
          <div className="text-end">
            <Button variant="primary" type="submit">
              {editMode ? 'Save Changes' : 'Add Job'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddJobModal;
