import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function CertificateRequest() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  
  const [formData, setFormData] = useState({
    recordType: '',
    parish: '',
    firstName: '',
    lastName: '',
    purpose: ''
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Updated List of Parishes under the Diocese of Kalookan (CAMANA area)
  const parishes = [
    'San Roque Cathedral Parish (Caloocan)',
    'Shrine of Our Lady of Grace Parish (Caloocan)',
    'Sagrada Familia Parish (Caloocan)',
    'Hearts of Jesus and Mary Parish (Caloocan)',
    'San Jose Parish - Agudo (Caloocan)',
    'St. Gabriel the Archangel Parish (Caloocan)',
    'San Bartolome Parish (Malabon)',
    'Immaculate Conception Parish (Malabon)',
    'Exaltation of the Holy Cross Parish (Malabon)',
    'San Antonio de Padua Parish (Malabon)',
    'San Jose de Navotas Parish (Navotas)',
    'San Ildefonso Parish (Navotas)',
    'San Lorenzo Ruiz Parish (Navotas)'
  ];

  // Calculate pickup date skipping weekends (3-5 business days)
  const calculatePickupDate = () => {
    const today = new Date();
    let businessDays = 0;
    let currentDate = new Date(today);
    
    // Add 3-5 business days (using 4 as average)
    while (businessDays < 4) {
      currentDate.setDate(currentDate.getDate() + 1);
      // 0 = Sunday, 6 = Saturday
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        businessDays++;
      }
    }
    
    return currentDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.recordType) newErrors.recordType = 'Please select a record type';
      if (!formData.parish) newErrors.parish = 'Please select a parish';
    } else if (step === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (formData.firstName && !/^[a-zA-Z\s'-]+$/.test(formData.firstName)) {
        newErrors.firstName = 'First name should only contain letters';
      }
      if (formData.lastName && !/^[a-zA-Z\s'-]+$/.test(formData.lastName)) {
        newErrors.lastName = 'Last name should only contain letters';
      }
    } else if (step === 3) {
      if (!formData.purpose.trim()) newErrors.purpose = 'Please provide the purpose of request';
      if (formData.purpose && formData.purpose.trim().length < 10) {
        newErrors.purpose = 'Purpose should be at least 10 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      const refNum = `REQ-${Math.floor(Math.random() * 9000 + 1000)}`;
      const pickupDateCalc = calculatePickupDate();
      setReferenceNumber(refNum);
      setPickupDate(pickupDateCalc);
      setIsSubmitted(true);
    }
  };

  // Render progress indicator
  const renderProgressIndicator = () => {
    return (
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              style={{
                flex: 1,
                textAlign: 'center',
                marginRight: step < 3 ? '1rem' : '0'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: currentStep >= step ? '#4CAF50' : '#e0e0e0',
                  color: currentStep >= step ? 'white' : '#999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  margin: '0 auto',
                  transition: 'all 0.3s ease'
                }}
              >
                {step}
              </div>
              <p style={{ fontSize: '12px', marginTop: '0.5rem', color: '#666' }}>
                {step === 1 && 'Record Type & Parish'}
                {step === 2 && 'Personal Details'}
                {step === 3 && 'Purpose'}
              </p>
            </div>
          ))}
        </div>
        <div style={{ height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              backgroundColor: '#4CAF50',
              width: `${(currentStep / 3) * 100}%`,
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="form-page">
        {isSubmitted ? (
          <div className="success-banner">
            <div style={{ fontSize: "32px", marginBottom: "0.75rem" }}>✅</div>
            <h2 className="form-title" style={{ fontSize: "20px" }}>Request Submitted</h2>
            <p className="form-sub" style={{ color: "#555", marginBottom: "1rem" }}>
              Your reference number is <strong>{referenceNumber}</strong>.<br />
              <span style={{ fontSize: '14px', marginTop: '0.5rem', display: 'block' }}>
                Expected Pickup Date: <strong style={{ color: '#4CAF50' }}>{pickupDate}</strong>
              </span>
            </p>
            <button className="btn-primary" style={{ marginTop: "1.5rem" }} onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <h1 className="form-title">Request a Sacramental Certificate</h1>
            <p className="form-sub">For baptismal, confirmation, marriage, burial, and other sacramental records.</p>
            
            <div className="form-note">
              ℹ️ Please provide accurate details matching your baptismal or parish registration records. Original documents must be presented upon pickup.
            </div>

            {renderProgressIndicator()}

            <form onSubmit={handleSubmit}>
              {/* STEP 1: Record Type & Parish */}
              {currentStep === 1 && (
                <>
                  <div className="form-group">
                    <label className="label">Type of Sacramental Record *</label>
                    <select
                      className="select"
                      name="recordType"
                      value={formData.recordType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select record type...</option>
                      <option value="baptism">Baptismal</option>
                      <option value="confirmation">Confirmation</option>
                      <option value="marriage">Marriage</option>
                    </select>
                    {errors.recordType && (
                      <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '0.25rem' }}>
                        {errors.recordType}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="label">Parish *</label>
                    <select
                      className="select"
                      name="parish"
                      value={formData.parish}
                      onChange={handleInputChange}
                    >
                      <option value="">Select your parish...</option>
                      {parishes.map((parish) => (
                        <option key={parish} value={parish}>
                          {parish}
                        </option>
                      ))}
                    </select>
                    {errors.parish && (
                      <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '0.25rem' }}>
                        {errors.parish}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* STEP 2: Personal Details */}
              {currentStep === 2 && (
                <div className="form-row">
                  <div className="form-group">
                    <label className="label">First Name *</label>
                    <input
                      type="text"
                      className="input"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                    {errors.firstName && (
                      <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '0.25rem' }}>
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="label">Last Name *</label>
                    <input
                      type="text"
                      className="input"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                    {errors.lastName && (
                      <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '0.25rem' }}>
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Purpose of Request */}
              {currentStep === 3 && (
                <div className="form-group">
                  <label className="label">Purpose of Request *</label>
                  <textarea
                    className="textarea"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    placeholder="e.g., For employment verification, school requirements, etc."
                  ></textarea>
                  {errors.purpose && (
                    <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '0.25rem' }}>
                      {errors.purpose}
                    </p>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handlePrevious}
                    style={{ backgroundColor: '#757575', color: '#fff' }}
                  >
                    ← Previous
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleNext}
                    style={{ marginLeft: currentStep === 1 ? 'auto' : '0' }}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ marginLeft: 'auto' }}
                  >
                    Submit Request →
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}