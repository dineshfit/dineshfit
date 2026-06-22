'use client';

export default function Hero({ customHeroSrc }) {
  const handleScrollToForm = () => {
    const formElement = document.getElementById('application-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section style={{
      position: 'relative',
      backgroundColor: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '80px 16px 64px 16px',
      boxSizing: 'border-box'
    }}>
      
      {/* Glow Ambient Ring */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{
          display: 'inline-block',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          backgroundColor: '#0a0a0a',
          color: '#fbbf24',
          padding: '6px 16px',
          borderRadius: '50px',
          fontSize: '10px',
          fontWeight: '900',
          letterSpacing: '2px',
          marginBottom: '24px'
        }}>
          🏆 ICN PRO ATHLETE ECOSYSTEM
        </div>
        
        <h1 style={{
          fontSize: 'clamp(40px, 8vw, 76px)',
          fontWeight: '900',
          color: '#ffffff',
          textTransform: 'uppercase',
          letterSpacing: '-2px',
          lineHeight: '0.95',
          margin: '0 0 16px 0'
        }}>
          TEAM <span style={{
            background: 'linear-gradient(to right, #fbbf24, #f59e0b, #d97706)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>DINESH</span>
        </h1>
        
        <p style={{
          color: '#a1a1aa',
          fontSize: '13px',
          fontWeight: '600',
          maxWidth: '500px',
          margin: '0 auto 32px auto',
          lineHeight: '1.6',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          Stop guessing. Build elite stage condition and your permanent athletic blueprint.
        </p>

        <div style={{ marginBottom: '40px' }}>
          <button 
            onClick={handleScrollToForm}
            style={{
              padding: '14px 28px',
              backgroundColor: 'transparent',
              border: '2px solid #f59e0b',
              color: '#f59e0b',
              fontWeight: '900',
              textTransform: 'uppercase',
              fontSize: '11px',
              letterSpacing: '1.5px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Begin Transformation Protocol
          </button>
        </div>

        {/* Showcase Area display */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #27272a',
          backgroundColor: '#050505',
          boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
          padding: '6px'
        }}>
          <img 
            src={customHeroSrc} 
            alt="Team Showcase Display" 
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: '10px',
              display: 'block'
            }}
          />
        </div>

      </div>
    </section>
  );
}