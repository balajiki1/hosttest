// src/components/Contact.js
import React from 'react';
import { Container, Typography, Grid, Card, CardContent, TextField } from '@mui/material';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import {  Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Contact = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, p: 4, borderRadius: 2 }}>
      {/* Back Button */}
      <Button variant="link" onClick={handleBackClick} className="p-0">
            <FaArrowLeft size={20} />
          </Button>

      {/* Header */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: '#3f51b5', fontWeight: 'bold', textTransform: 'uppercase', mb: 4 }}
      >
        Contact Us
      </Typography>

      {/* Contact Information Section */}
      <section style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '40px' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1565c0' }}>
          Get in Touch
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <FaPhone size={20} style={{ color: '#1565c0' }} />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>Phone</Typography>
                <Typography variant="body2" color="textSecondary">+1 234 567 890</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <FaEnvelope size={20} style={{ color: '#1565c0' }} />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>Email</Typography>
                <Typography variant="body2" color="textSecondary">contact@company.com</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <FaMapMarkerAlt size={20} style={{ color: '#1565c0' }} />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>Address</Typography>
                <Typography variant="body2" color="textSecondary">
                  123 Main St, Suite 500, City, State, ZIP
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section>

      {/* Contact Form Section */}
      <section style={{ backgroundColor: '#f1f8e9', padding: '20px', borderRadius: '8px', marginTop: '40px' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
          Send Us a Message
        </Typography>
        <form noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                variant="outlined"
                multiline
                rows={4}
                required
              />
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" sx={{ mt: 3 }}>
            Send Message
          </Button>
        </form>
      </section>
    </Container>
  );
};

export default Contact;
