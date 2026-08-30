import React, { useState } from 'react';
import { MapPin, Phone, Clock, ShoppingCart, CheckCircle2, Navigation, Sparkles } from 'lucide-react';
import { PHARMACIES } from '../data/pharmacyData';
import { BANGLADESHI_MEDICINES } from '../data/medicinesData';
import confetti from 'canvas-confetti';

export default function PharmacyFinder() {
  const [selectedMedicine, setSelectedMedicine] = useState('Napa Extra');
  const [selectedArea, setSelectedArea] = useState('All');
  const [orderModal, setOrderModal] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const areas = ['All', 'Dhanmondi, Dhaka', 'Gulshan, Dhaka', 'Mirpur, Dhaka', 'Uttara, Dhaka'];

  const filteredPharmacies = PHARMACIES.filter(ph => {
    if (selectedArea !== 'All' && ph.area !== selectedArea) return false;
    return true;
  });

  const handleOrder = (pharmacy, medName, medData) => {
    setOrderModal({ pharmacy, medName, medData });
    setOrderConfirmed(false);
  };

  const handleConfirmOrder = () => {
    setOrderConfirmed(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setOrderModal(null);
      setOrderConfirmed(false);
    }, 2000);
  };

  return (
    <div style={{ padding: '8px 0 36px' }}>
      <div className="container-max">
        {/* Module Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#e0f2fe',
            color: '#0369a1',
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '6px'
          }}>
            MODULE 5 • PHARMACY AVAILABILITY & RADAR
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            Pharmacy Stock Radar & Generic Substitutes (ফার্মেসি স্টক)
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
            নিকটস্থ ফার্মেসিতে প্রেসক্রিপশনের ওষুধের স্টক যাচাই করুন এবং স্টক না থাকলে সঠিক বিকল্প জেনেরিক ওষুধ খুঁজে নিন।
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="clean-card" style={{
          padding: '16px 20px',
          background: '#ffffff',
          borderRadius: '14px',
          marginBottom: '20px',
          display: 'flex',
          gap: '14px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '3px' }}>
                Select Medicine (ওষুধ নির্বাচন):
              </label>
              <select
                value={selectedMedicine}
                onChange={(e) => setSelectedMedicine(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: '#f8fafc',
                  cursor: 'pointer'
                }}
              >
                {BANGLADESHI_MEDICINES.map(m => (
                  <option key={m.id} value={m.brandName}>{m.brandName} ({m.generic})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '3px' }}>
                Area / Location (এলাকা):
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  color: '#0f172a',
                  background: '#f8fafc',
                  cursor: 'pointer'
                }}
              >
                {areas.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            color: '#166534',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Navigation size={14} color="#059669" />
            <span>Live GPS Radar • Within 5 KM</span>
          </div>
        </div>

        {/* Pharmacy Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredPharmacies.map(pharmacy => {
            const medStock = pharmacy.inventory[selectedMedicine] || { status: 'out_of_stock', stock: 'Out of Stock', price: 0 };
            const isAvailable = medStock.status === 'available';
            const isLow = medStock.status === 'low';

            return (
              <div
                key={pharmacy.id}
                className="clean-card"
                style={{
                  padding: '18px',
                  background: '#ffffff',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '1.05rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>
                      {pharmacy.name}
                    </h3>
                    <span style={{
                      background: '#fef3c7',
                      color: '#b45309',
                      padding: '2px 6px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      ★ {pharmacy.rating}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#64748b', marginBottom: '3px' }}>
                    <MapPin size={13} color="#0284c7" />
                    <span>{pharmacy.address} ({pharmacy.distanceKm} km away)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#64748b', marginBottom: '12px' }}>
                    <Clock size={13} color="#059669" />
                    <span>{pharmacy.openHours}</span>
                  </div>

                  {/* Stock Status Box */}
                  <div style={{
                    background: isAvailable ? '#f0fdf4' : isLow ? '#fefce8' : '#fef2f2',
                    border: '1px solid',
                    borderColor: isAvailable ? '#bbf7d0' : isLow ? '#fef08a' : '#fecaca',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{selectedMedicine}</span>
                      <span style={{
                        background: isAvailable ? '#059669' : isLow ? '#d97706' : '#e11d48',
                        color: '#ffffff',
                        padding: '1px 6px',
                        borderRadius: '999px',
                        fontSize: '0.68rem',
                        fontWeight: 700
                      }}>
                        {isAvailable ? '✓ In Stock' : isLow ? '⚠️ Low Stock' : '✕ Out of Stock'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                      Stock: <strong>{medStock.stock}</strong> • Price: <strong>৳ {medStock.price}</strong> / unit
                    </div>

                    {medStock.substitute && (
                      <div style={{
                        marginTop: '6px',
                        paddingTop: '6px',
                        borderTop: '1px dashed #cbd5e1',
                        fontSize: '0.73rem',
                        color: '#0369a1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Sparkles size={12} />
                        <span>Generic Substitute: <strong>{medStock.substitute} (একই কার্যকারিতা)</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <a
                    href={`tel:${pharmacy.phone}`}
                    className="btn-outline"
                    style={{ flex: 1, padding: '7px 10px', fontSize: '0.78rem', textAlign: 'center' }}
                  >
                    <Phone size={13} />
                    <span>Call Store</span>
                  </a>

                  <button
                    onClick={() => handleOrder(pharmacy, selectedMedicine, medStock)}
                    disabled={!isAvailable && !isLow}
                    className="btn-primary"
                    style={{
                      flex: 1.2,
                      padding: '7px 10px',
                      fontSize: '0.78rem',
                      opacity: (!isAvailable && !isLow) ? 0.5 : 1,
                      cursor: (!isAvailable && !isLow) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ShoppingCart size={13} />
                    <span>Order Delivery</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {orderModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div className="clean-card" style={{
              background: '#ffffff',
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              {!orderConfirmed ? (
                <>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    <ShoppingCart size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '6px', fontWeight: 700 }}>
                    Confirm Home Delivery Order
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '14px' }}>
                    Requesting delivery for <strong>{orderModal.medName}</strong> from <strong>{orderModal.pharmacy.name}</strong>.
                  </p>

                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', textAlign: 'left', fontSize: '0.8rem', marginBottom: '16px' }}>
                    <div>Medicine: <strong>{orderModal.medName}</strong></div>
                    <div>Price: <strong>৳ {orderModal.medData.price}</strong></div>
                    <div>Delivery Fee: <strong>৳ 40</strong> (Est: 30 minutes)</div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setOrderModal(null)}
                      className="btn-outline"
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmOrder}
                      className="btn-primary"
                      style={{ flex: 1 }}
                    >
                      Confirm Order
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#15803d', marginBottom: '6px', fontWeight: 700 }}>
                    Order Placed Successfully! 🎉
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Pharmacy delivery rider is on the way.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
