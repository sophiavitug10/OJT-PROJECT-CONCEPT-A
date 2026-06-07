import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AppointmentBooking() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  // 1. State to hold user input
  const [formData, setFormData] = useState({
    appointmentType: '',
    date: '',
    time: '',
    fullName: '',
    phone: ''
  });

  // 2. State to hold error messages for the UI
  const [errors, setErrors] = useState({});

  // Handle typing and clearing errors automatically
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 3. The Validation Logic (Checks for empties, weekends, and valid phone numbers)
  const validateForm = () => {
    const newErrors = {};

    if (!formData.appointmentType) newErrors.appointmentType = 'Please select an appointment type.';
    if (!formData.time) newErrors.time = 'Please select a preferred time.';
    if (!formData.fullName.trim()) newErrors.fullName = 'Your full name is required.';
    
    // Phone Number Validation (Checks for 11 digits)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required so we can contact you.';
    } else if (!/^[0-9]{11}$/.test(formData.phone.replace(/[- ]/g, ''))) {
      newErrors.phone = 'Please enter a valid 11-digit mobile number (e.g., 09171234567).';
    }

    // Date and Weekend Validation
    if (!formData.date) {
      newErrors.date = 'Please select a date.';
    } else {
      const selectedDate = new Date(formData.date);
      const dayOfWeek = selectedDate.getDay();
      
      // 0 is Sunday, 6 is Saturday
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        newErrors.date = 'Parish offices are closed on weekends. Please select a Monday through Friday.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-page">
        {isSubmitted ? (
          <div className="success-banner">
            <div style={{ fontSize: "32px", marginBottom: "0.75rem" }}>📅</div>
            <h2 className="form-title" style={{ fontSize: "20px" }}>Appointment Requested</h2>
            <p className="form-sub" style={{ color: "#555", marginBottom: "0" }}>
              Your request for <strong>{formData.appointmentType}</strong> on <strong>{formData.date}</strong> has been received. Our parish staff will text or call you at <strong>{formData.phone}</strong> to confirm your slot.
            </p>
            <button className="btn-primary" style={{ marginTop: "1.5rem" }} onClick={() => navigate('/')}>Back to Home</button>
          </div>
        ) : (
          <>
            <h1 className="form-title">Book a Pastoral Appointment</h1>
            <p className="form-sub">Schedule a meeting with the parish priest or staff for guidance and pastoral services.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label">Appointment Type *</label>
                <select 
                  className="select" 
                  name="appointmentType" 
                  value={formData.appointmentType} 
                  onChange={handleInputChange}
                >
                  <option value="">Select type...</option>
                  <option value="Pastoral Counseling">Pastoral Counseling</option>
                  <option value="Marriage Preparation">Marriage Preparation</option>
                  <option value="Baptismal Briefing">Baptismal Briefing</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
                {/* INLINE ERROR MESSAGE */}
                {errors.appointmentType && (
                  <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '0.25rem' }}>{errors.appointmentType}</p>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="label">Preferred Date *</label>
                  <input 
                    type="date" 
                    className="input" 
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                  {errors.date && (
                    <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '0.25rem' }}>{errors.date}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="label">Preferred Time *</label>
                  <input 
                    type="time" 
                    className="input" 
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                  />
                  {errors.time && (
                    <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '0.25rem' }}>{errors.time}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="label">Full Name *</label>
                <input 
                  type="text" 
                  className="input" 
                  name="fullName"
                  placeholder="e.g., Juan Dela Cruz"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                {errors.fullName && (
                  <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '0.25rem' }}>{errors.fullName}</p>
                )}
              </div>

              <div className="form-group">
                <label className="label">Contact Number *</label>
                <input 
                  type="tel" 
                  className="input" 
                  name="phone"
                  placeholder="0917 123 4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && (
                  <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '0.25rem' }}>{errors.phone}</p>
                )}
              </div>

              <button type="submit" className="btn-primary">Request Appointment →</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}