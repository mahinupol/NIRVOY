import React, { useState } from 'react';
import { MapPin, Phone, Clock, ShoppingCart, CheckCircle2, AlertTriangle, XCircle, Sparkles, Navigation, Search, Check } from 'lucide-react';
import { PHARMACIES } from '../data/pharmacyData';
import { BANGLADESHI_MEDICINES } from '../data/medicinesData';
import confetti from 'canvas-confetti';

export default function PharmacyFinder({ lang }) {
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
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setOrderModal(null);
      setOrderConfirmed(false);
    }, 2200);
  };

  return (
    <div style={{ padding: '10px 0 40px' }}>
      <div className="container-custom">
        {/* Module Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#e0f2fe',
            color: '#0284c7',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            MODULE 5 • PHARMACY AVAILABILITY & RADAR
          </div>
          <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '8px' }}>
            {lang === 'bn' ? 'নিকটস্থ ফার্মেসিতে ঔষধের স্টক ও বিকল্প সন্ধান' : 'Nearby Pharmacy Stock & Substitute Radar'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '680px', margin: '0 auto' }}>
            {lang === 'bn' 
              ? 'প্রেসক্রিপশনের যেকোনো ঔষধ আপনার আশেপাশের কোন ফার্মেসিতে পাওয়া যাবে এবং স্টক না থাকলে সঠিক বিকল্প কি হবে তা তাৎক্ষণিক জানুন।'
              : 'Locate in-stock medicines across registered pharmacies in Dhaka and view verified generic alternatives.'}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="playful-card" style={{
          padding: '20px',
          background: 'white',
          borderRadius: '20px',
          marginBottom: '28px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
            {/* Medicine Selector */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                ঔষধ নির্বাচন করুন (Medicine):
              </label>
              <select
                value={selectedMedicine}
                onChange={(e) => setSelectedMedicine(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: 700,
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

            {/* Area Filter */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                এলাকা / লোকেশন (Area):
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
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
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            padding: '8px 16px',
            borderRadius: '999px',
            fontSize: '0.85rem',
            color: '#065f46',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Navigation size={16} color="#10b981" />
            <span>লাইভ জিপিএস রেডি • ৫ কিমি এর মধ্যে</span>
          </div>
        </div>

        {/* Pharmacy Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredPharmacies.map(pharmacy => {
            const medStock = pharmacy.inventory[selectedMedicine] || { status: 'out_of_stock', stock: 'Out of Stock', price: 0 };
            const isAvailable = medStock.status === 'available';
            const isLow = medStock.status === 'low';

            return (
              <div
                key={pharmacy.id}
                className="playful-card"
                style={{
                  padding: '24px',
                  background: 'white',
                  borderRadius: '24px',
                  border: '1.5px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Pharmacy Title & Rating */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0 }}>
                      {pharmacy.name}
                    </h3>
                    <span style={{
                      background: '#fef08a',
                      color: '#854d0e',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 800
                    }}>
                      ★ {pharmacy.rating}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                    <MapPin size={14} color="#0ea5e9" />
                    <span>{pharmacy.address} ({pharmacy.distanceKm} km away)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b', marginBottom: '14px' }}>
                    <Clock size={14} color="#10b981" />
                    <span>{pharmacy.openHours}</span>
                  </div>

                  {/* Stock Status Box */}
                  <div style={{
                    background: isAvailable ? '#f0fdf4' : isLow ? '#fefce8' : '#fef2f2',
                    border: '1.5px solid',
                    borderColor: isAvailable ? '#bbf7d0' : isLow ? '#fef08a' : '#fecaca',
                    padding: '14px',
                    borderRadius: '16px',
                    marginBottom: '14px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{selectedMedicine}</span>
                      <span style={{
                        background: isAvailable ? '#10b981' : isLow ? '#f59e0b' : '#ef4444',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 800
                      }}>
                        {isAvailable ? '✓ ইন-স্টক' : isLow ? '⚠️ সীমিত স্টক' : '✕ স্টক নেই'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                      পরিমাণ: <strong>{medStock.stock}</strong> • একক মূল্য: <strong>৳ {medStock.price}</strong>
                    </div>

                    {/* If out of stock, show suggested alternative */}
                    {medStock.substitute && (
                      <div style={{
                        marginTop: '8px',
                        paddingTop: '8px',
                        borderTop: '1px dashed #cbd5e1',
                        fontSize: '0.78rem',
                        color: '#0369a1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Sparkles size={14} />
                        <span>বিকল্প ড্রাগ উপলব্ধ: <strong>{medStock.substitute} (একই কার্যকারিতা)</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <a
                    href={`tel:${pharmacy.phone}`}
                    className="playful-btn playful-btn-outline"
                    style={{ flex: 1, padding: '10px', fontSize: '0.82rem', textAlign: 'center' }}
                  >
                    <Phone size={14} />
                    <span>কল করুন</span>
                  </a>

                  <button
                    onClick={() => handleOrder(pharmacy, selectedMedicine, medStock)}
                    disabled={!isAvailable && !isLow}
                    className="playful-btn playful-btn-primary"
                    style={{
                      flex: 1.2,
                      padding: '10px',
                      fontSize: '0.82rem',
                      opacity: (!isAvailable && !isLow) ? 0.5 : 1,
                      cursor: (!isAvailable && !isLow) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ShoppingCart size={14} />
                    <span>অর্ডার / ডেলিভারি</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Order Confirmation Modal */}
        {orderModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div className="playful-card" style={{
              background: 'white',
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              borderRadius: '24px',
              textAlign: 'center'
            }}>
              {!orderConfirmed ? (
                <>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <ShoppingCart size={30} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '8px' }}>
                    হোম ডেলিভারি বুকিং নিশ্চিতকরণ
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
                    <strong>{orderModal.pharmacy.name}</strong> থেকে <strong>{orderModal.medName}</strong> ডেলিভারির অনুরোধ পাঠানো হচ্ছে।
                  </p>

                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', textAlign: 'left', fontSize: '0.85rem', marginBottom: '20px' }}>
                    <div>ঔষধ: <strong>{orderModal.medName}</strong></div>
                    <div>দাম: <strong>৳ {orderModal.medData.price}</strong> / পাতা বা ইউনিট</div>
                    <div>ডেলিভারি ফি: <strong>৳ ৪০</strong> (৩০ মিনিটের মধ্যে)</div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setOrderModal(null)}
                      className="playful-btn playful-btn-outline"
                      style={{ flex: 1 }}
                    >
                      বাতিল
                    </button>
                    <button
                      onClick={handleConfirmOrder}
                      className="playful-btn playful-btn-primary"
                      style={{ flex: 1 }}
                    >
                      অর্ডার নিশ্চিত করুন
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', color: '#15803d', marginBottom: '8px' }}>
                    অর্ডার সফল হয়েছে! 🎉
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    ফার্মেসি রাইডার ৩০ মিনিটের মধ্যে ঔষধ পৌঁছে দেওয়ার জন্য রওনা হবে।
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
