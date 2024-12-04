import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, CircularProgress, Box } from '@mui/material';
import { Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const Company = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Local array of company names
  const companyNames = ['Amazon', 'Best Buy', 'Shopify', 'Apple', 'Microsoft', 'Google'];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await api.get('/getImages');
        setImages(response.data.images); // Fetch only images from API
        setLoading(false);
      } catch (error) {
        console.error('Error fetching images:', error);
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5, p: 4, borderRadius: 2 }}>
      {/* Back Button */}
      <Button variant="link" onClick={handleBackClick} className="p-0" style={{ marginBottom: '20px' }}>
        <FaArrowLeft size={20} /> 
      </Button>

      {/* Header */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: '#3f51b5', fontWeight: 'bold', textTransform: 'uppercase', mb: 4 }}
      >
        Company Gallery
      </Typography>

      {/* Image Gallery */}
      <Grid container spacing={4} sx={{ p: 4, borderRadius: 2 }}>
        {images.map((imagePath, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:8001${imagePath}`} // Display image from API
                alt={companyNames[index] || `Company ${index + 1}`} // Use company name or default text
                sx={{ borderRadius: 2 }}
              />
              <CardContent>
                <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
                  {companyNames[index] || `Company ${index + 1}`} {/* Display name or fallback */}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Company;
