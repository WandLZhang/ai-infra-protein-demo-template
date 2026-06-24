import React, { useState, useRef, useEffect, useCallback } from 'react'
import { config } from '../config'

interface SetupValues {
  institutionShortName: string
  institutionFullName: string
  buildingName: string
  loginNode: string
  markerSubtitle: string
  lat: number
  lng: number
}

interface Props {
  visible: boolean
}

export default function SetupWizard({ visible }: Props) {
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<SetupValues>({
    institutionShortName: config.institution.shortName,
    institutionFullName: config.institution.fullName,
    buildingName: config.home.buildingName,
    loginNode: config.home.loginNode,
    markerSubtitle: config.home.markerSubtitle,
    lat: config.home.markerLatLng.lat,
    lng: config.home.markerLatLng.lng,
  })
  const [copied, setCopied] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  useEffect(() => {
    if (!open || !searchInputRef.current || !window.google?.maps?.places) return
    const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
      fields: ['geometry', 'name', 'formatted_address'],
    })
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place?.geometry?.location) return
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      const name = place.name || ''
      setValues(v => ({
        ...v,
        lat,
        lng,
        buildingName: name.toUpperCase() || v.buildingName,
      }))
    })
  }, [open])

  const generateConfig = useCallback(() => {
    const v = values
    return `export const config = {
  institution: {
    shortName: '${v.institutionShortName}',
    fullName: '${v.institutionFullName}',
    pageTitle: '${v.institutionShortName} HPC with Google',
    menuSubtitle: '${v.institutionShortName} Research Computing · TPU vs GPU',
  },
  home: {
    buildingName: '${v.buildingName.toUpperCase()}',
    markerLatLng: { lat: ${v.lat}, lng: ${v.lng} },
    cameraLatLng: { lat: ${(v.lat - 0.025).toFixed(4)}, lng: ${(v.lng + 0.096).toFixed(4)} },
    loginNode: '${v.loginNode}',
    markerSubtitle: '${v.markerSubtitle}',
    controllerConsoleHref: '',
    displayBucket: 'gs://${v.institutionShortName.toLowerCase().replace(/\s+/g, '-')}-research',
  },
  deploy: {
    firebaseSite: '${v.institutionShortName.toLowerCase().replace(/\s+/g, '-')}-protein-demo',
  },
}
`
  }, [values])

  const handleCopy = () => {
    navigator.clipboard.writeText(generateConfig())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!visible) return null

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '6px 8px', border: '1px solid #ccc', borderRadius: 3,
    fontSize: 12, fontFamily: 'freight-sans-pro, sans-serif', background: '#fff', color: '#333',
    boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 10, fontWeight: 600, color: '#708090',
    letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3, marginTop: 10,
    fontFamily: 'freight-sans-pro, sans-serif',
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        title="Configure institution"
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
          fontSize: 14, color: '#999', opacity: 0.6, transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
      >
        ⚙
      </button>

      {open && (
        <div
          ref={panelRef}
          style={{
            position: 'absolute', bottom: '100%', left: 0, marginBottom: 8,
            width: 320, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
            borderRadius: 6, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            padding: '16px 18px', zIndex: 100,
            border: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: '#333', fontFamily: 'freight-sans-pro, sans-serif', marginBottom: 4 }}>
            Configure Institution
          </div>
          <div style={{ fontSize: 10, color: '#999', marginBottom: 8, fontFamily: 'freight-sans-pro, sans-serif' }}>
            Set up the demo for a new institution. Copy the generated config into <code style={{ fontSize: 10 }}>institution.config.ts</code>.
          </div>

          <label style={labelStyle}>Institution name</label>
          <input style={inputStyle} value={values.institutionShortName}
            onChange={e => setValues(v => ({ ...v, institutionShortName: e.target.value }))}
            placeholder="Cornell" />

          <label style={labelStyle}>Full name</label>
          <input style={inputStyle} value={values.institutionFullName}
            onChange={e => setValues(v => ({ ...v, institutionFullName: e.target.value }))}
            placeholder="Cornell University" />

          <label style={labelStyle}>Building (search)</label>
          <input ref={searchInputRef} style={inputStyle} placeholder="Search for a building or address..." />

          <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
            <div style={{ flex: 1 }}>
              <label style={{ ...labelStyle, marginTop: 6 }}>Lat</label>
              <input style={inputStyle} type="number" step="0.0001" value={values.lat}
                onChange={e => setValues(v => ({ ...v, lat: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ ...labelStyle, marginTop: 6 }}>Lng</label>
              <input style={inputStyle} type="number" step="0.0001" value={values.lng}
                onChange={e => setValues(v => ({ ...v, lng: parseFloat(e.target.value) || 0 }))} />
            </div>
          </div>

          <label style={labelStyle}>Building name (display)</label>
          <input style={inputStyle} value={values.buildingName}
            onChange={e => setValues(v => ({ ...v, buildingName: e.target.value }))}
            placeholder="RHODES HALL" />

          <label style={labelStyle}>Login node hostname</label>
          <input style={inputStyle} value={values.loginNode}
            onChange={e => setValues(v => ({ ...v, loginNode: e.target.value }))}
            placeholder="cbsulogin" />

          <label style={labelStyle}>Marker subtitle</label>
          <input style={inputStyle} value={values.markerSubtitle}
            onChange={e => setValues(v => ({ ...v, markerSubtitle: e.target.value }))}
            placeholder="cbsulogin · BioHPC" />

          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <button onClick={handleCopy} style={{
              flex: 1, padding: '7px 12px', fontSize: 11, fontWeight: 600,
              background: '#333', color: '#fff', border: 'none', borderRadius: 3,
              cursor: 'pointer', fontFamily: 'freight-sans-pro, sans-serif',
              letterSpacing: '0.04em',
            }}>
              {copied ? '✓ Copied' : 'Copy Config'}
            </button>
            <button onClick={() => setOpen(false)} style={{
              padding: '7px 12px', fontSize: 11,
              background: 'transparent', color: '#999', border: '1px solid #ddd', borderRadius: 3,
              cursor: 'pointer', fontFamily: 'freight-sans-pro, sans-serif',
            }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
