import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, MapPin, Camera, Sparkles, X } from 'lucide-react';
import { useCitizen } from './CitizenContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon issue for webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
};

const SubmitGrievance = () => {
  const navigate = useNavigate();
  const { addGrievance, currentUser } = useCitizen();
  
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
  // Image State
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  
  // Map State
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [position, setPosition] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAiEnhance = async () => {
    if (!description.trim()) return;
    setIsAiProcessing(true);
    try {
      const res = await fetch('http://localhost:8000/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: description })
      });
      if (res.ok) {
        const data = await res.json();
        setDescription(data.enhancedText);
      } else {
        alert('AI enhancement failed. Please check the backend console or API key.');
      }
    } catch (err) {
      console.error(err);
      alert('AI enhancement failed.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const title = description.length > 40 ? description.substring(0, 40) + '...' : description;
    let locationStr = 'Location Not Provided';
    if (position) locationStr = `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`;

    addGrievance({
      title,
      description,
      location: locationStr,
      image: image // base64
    });
    
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/my-grievances');
    }, 1000);
  };

  if (!currentUser) return <div style={{ textAlign: 'center', padding: '3rem' }}>Please login first to submit a grievance.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', paddingTop: '2rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Report an Issue</h1>
        <p style={{ fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
          Describe the problem in your own words. Our AI will automatically classify and route it to the right department.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text)', fontSize: '1.125rem' }}>
              What's the problem?
            </label>
            <div style={{ position: 'relative' }}>
              <textarea 
                rows="6"
                placeholder="e.g., There's a massive pothole at the ABC Junction that's been causing accidents for the past week. Please fix it urgently."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              ></textarea>
              <button 
                type="button"
                onClick={handleAiEnhance}
                disabled={isAiProcessing || !description.trim()}
                style={{ 
                  position: 'absolute', bottom: '1rem', right: '1rem', 
                  color: 'var(--primary)', display: 'flex', alignItems: 'center', 
                  gap: '0.375rem', fontSize: '0.875rem', fontWeight: 600, 
                  background: 'var(--primary-light)', padding: '0.5rem 1rem', 
                  borderRadius: '999px', border: 'none', cursor: 'pointer',
                  opacity: (isAiProcessing || !description.trim()) ? 0.6 : 1,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}
              >
                <Sparkles size={16} /> {isAiProcessing ? 'It will take a while, please wait...' : 'AI Assisted'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div 
              className="glass-card" 
              onClick={() => setIsMapOpen(true)}
              style={{ padding: '1.5rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', border: position ? '2px solid var(--primary)' : '2px solid transparent' }}
            >
              <div className="icon-container icon-indigo" style={{ marginBottom: '1rem' }}>
                <MapPin size={24} />
              </div>
              <h4 style={{ marginBottom: '0.25rem' }}>{position ? 'Location Selected' : 'Add Location'}</h4>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                {position ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : 'Use GPS or select on map'}
              </p>
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImageUpload} 
            />
            <div 
              className="glass-card" 
              onClick={() => fileInputRef.current.click()}
              style={{ padding: '1.5rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', position: 'relative', border: image ? '2px solid var(--mint)' : '2px solid transparent' }}
            >
              {image ? (
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2 }} />
              ) : null}
              
              <div style={{ position: 'relative', zIndex: 10 }}>
                <div className="icon-container icon-mint" style={{ marginBottom: '1rem', margin: '0 auto' }}>
                  <Camera size={24} />
                </div>
                <h4 style={{ marginBottom: '0.25rem' }}>{image ? 'Photo Attached' : 'Attach Photo'}</h4>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>{image ? 'Click to change' : 'Upload image of the issue'}</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem', borderRadius: '16px' }}
              disabled={isSubmitting || !description.trim()}
            >
              {isSubmitting ? 'Submitting Report...' : (
                <>
                  <Send size={20} />
                  Submit Grievance
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {isMapOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '90%', maxWidth: '600px', position: 'relative' }}>
            <button onClick={() => setIsMapOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '1rem' }}>Select Location</h2>
            <div style={{ height: '350px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid #E2E8F0' }}>
              <MapContainer center={[20.5937, 78.9629]} zoom={4} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                {position ? `Selected: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : 'Click on the map to pin a location.'}
              </p>
              <button onClick={() => setIsMapOpen(false)} className="btn btn-primary" disabled={!position} style={{ padding: '0.5rem 1.5rem' }}>Confirm Location</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitGrievance;
