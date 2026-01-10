'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useEnterNavigation } from '@/hooks/useEnterNavigation';
import EonmedsLogo from '@/components/EonmedsLogo';

// Google Maps types
interface GoogleMapsPlace {
  formatted_address?: string;
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry?: {
    location: google.maps.LatLng;
  };
}

interface GoogleMapsAutocomplete {
  getPlace: () => GoogleMapsPlace;
  addListener: (event: string, callback: () => void) => void;
}

declare global {
  interface Window {
    google: typeof google;
    initGmaps: () => void;
  }
}

export default function AddressPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [mapError, setMapError] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showApartmentWarning, setShowApartmentWarning] = useState(false);
  const [addressComponents, setAddressComponents] = useState<{
    city?: string;
    state?: string;
    zipCode?: string;
  } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<GoogleMapsAutocomplete | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // Function to detect if apartment/suite might be needed
  const shouldSuggestApartment = (addressText: string) => {
    if (!addressText) return false;
    
    const addressLower = addressText.toLowerCase();
    
    // Keywords that indicate multi-unit buildings
    const multiUnitKeywords = [
      'apartment', 'apt', 'complex', 'tower',
      'building', 'bldg', 'suite', 'ste', 
      'unit', 'plaza', 'court', 'commons',
      'center', 'centre', 'loft', 'flats',
      'condominium', 'condo', 'residence'
    ];
    
    // Check for any multi-unit keywords
    const hasMultiUnitKeyword = multiUnitKeywords.some(keyword => 
      addressLower.includes(keyword)
    );
    
    // Don't show warning if apartment already provided
    if (apartment) return false;
    
    return hasMultiUnitKeyword;
  };

  // Update warning when apartment field changes
  useEffect(() => {
    if (address && shouldSuggestApartment(address) && !apartment) {
      setShowApartmentWarning(true);
    } else {
      setShowApartmentWarning(false);
    }
  }, [apartment, address]);

  // Load Google Maps script
  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeAutocomplete();
      return;
    }

    // Check if script is already in the DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          initializeAutocomplete();
        }
      }, 100);
      return;
    }

    // Load the Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      initializeAutocomplete();
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Maps');
      setMapError(true);
    };
    
    document.head.appendChild(script);
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) return;
    
    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address', 'geometry']
      }) as unknown as GoogleMapsAutocomplete;

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (!place) return;
        
        if (place.formatted_address) {
          setAddress(place.formatted_address);
          setShowMap(true);
          
          // Parse address components for better storage
          if (place.address_components) {
            const components: { city?: string; state?: string; zipCode?: string } = {};
            place.address_components.forEach((component) => {
              const types = component.types;
              if (types.includes('locality')) components.city = component.long_name;
              if (types.includes('administrative_area_level_1')) components.state = component.short_name;
              if (types.includes('postal_code')) components.zipCode = component.long_name;
            });
            setAddressComponents(components);
          }
          
          // Check if apartment might be needed
          const needsApartment = shouldSuggestApartment(place.formatted_address);
          setShowApartmentWarning(needsApartment);
          
          // Initialize map after a short delay
          setTimeout(() => {
            if (!mapInstanceRef.current && mapRef.current) {
              initializeMap();
            }
            
            // Update map location
            if (place.geometry?.location && mapInstanceRef.current) {
              updateMapLocation(place.geometry.location);
            }
          }, 100);
        }
      });
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
      setMapError(true);
    }
  };
  
  // Initialize map when showMap becomes true
  useEffect(() => {
    if (showMap && !mapInstanceRef.current && mapRef.current && window.google?.maps) {
      initializeMap();
    }
  }, [showMap]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google?.maps) return;

    try {
      // Default to Tampa, FL
      const defaultLocation = { lat: 27.9506, lng: -82.4572 };
      
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 18,
        center: defaultLocation,
        mapTypeId: 'satellite',
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: false,
        scaleControl: false,
        rotateControl: false,
        disableDefaultUI: true,
        tilt: 45,
      });

      // Custom marker with our brand color
      markerRef.current = new window.google.maps.Marker({
        map: mapInstanceRef.current,
        position: defaultLocation,
        draggable: false,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#cab172',
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }
      });
    } catch (error) {
      console.error('Error initializing Google Map:', error);
      setMapError(true);
    }
  };

  const updateMapLocation = (location: google.maps.LatLng) => {
    if (!mapInstanceRef.current || !location) return;

    // Center map on the location with closer zoom
    mapInstanceRef.current.setCenter(location);
    mapInstanceRef.current.setZoom(19);

    // Update marker position
    if (markerRef.current) {
      markerRef.current.setPosition(location);
    }
  };

  const handleContinue = () => {
    if (address) {
      // Parse the address to extract components
      const fullAddress = apartment 
        ? `${address}, ${apartment}`
        : address;
        
      sessionStorage.setItem('intake_address', JSON.stringify({ 
        street: address,
        unit: apartment,
        city: addressComponents?.city || '',
        state: addressComponents?.state || '',
        zipCode: addressComponents?.zipCode || '',
        fullAddress: fullAddress
      }));
      router.push('/intake/ideal-weight');
    }
  };
  
  // Enable Enter key navigation
  useEnterNavigation(handleContinue);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-1/4 bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-2xl mx-auto w-full">
        <Link href="/intake/support-info" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>

      {/* EONMeds Logo */}
      <EonmedsLogo compact={true} />

      {/* Cold Shipping Banner */}
      <div className="px-6 mt-3 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="bg-[#f5ecd8] rounded-3xl overflow-hidden flex items-stretch">
          <div className="flex-1 px-5 py-3 flex flex-col justify-center">
            <h3 className="font-semibold text-base text-black">{t('address.shipping.title')}</h3>
            <p className="text-xs text-gray-600 font-normal mt-0.5">{t('address.shipping.subtitle')}</p>
          </div>
          <div className="flex-shrink-0 bg-gray-200 rounded-r-3xl">
            <img 
              src="https://static.wixstatic.com/media/c49a9b_4d682057194f4e1fa67cf62dd50a1d27~mv2.webp"
              alt="Cold Shipping"
              className="h-20 w-20 object-cover rounded-r-3xl"
            />
          </div>
        </div>
      </div>
      
      <div className="flex-1 px-6 lg:px-8 py-4 pb-48 max-w-md lg:max-w-lg mx-auto w-full overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h1 className="page-title mb-2">{t('address.title')}</h1>
            <p className="page-subtitle text-sm mb-1">{t('address.subtitle')}</p>
            <p className="text-xs text-[#413d3d]/50">{t('address.asterisk')}</p>
          </div>

          {/* Google Map - Only show after address is entered */}
          {showMap && (
            <div ref={mapRef} className="w-full h-48 rounded-2xl border border-white/20 bg-white/10 relative overflow-hidden">
              {mapError && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/10 rounded-2xl">
                  <div className="text-center">
                    <p className="text-[#413d3d]/70 text-sm">Map unavailable</p>
                    <p className="text-[#413d3d]/50 text-xs mt-1">Enter address manually</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <input
              ref={inputRef}
              type="text"
              placeholder={t('address.placeholder')}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={(e) => {
                // Check for apartment suggestion when manually typing
                if (e.target.value && !apartment) {
                  setShowApartmentWarning(shouldSuggestApartment(e.target.value));
                }
              }}
              className="input-field w-full"
            />
            
            <input
              type="text"
              placeholder={t('address.apartment')}
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              className="input-field w-full"
            />
            
            {/* Apartment Warning */}
            {showApartmentWarning && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="text-left">
                    <p className="text-sm text-yellow-800 font-medium">
                      {language === 'es' 
                        ? 'Esta dirección puede requerir un número de apartamento/suite'
                        : 'This address may require an apartment/suite number'}
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      {language === 'es'
                        ? 'Por favor agregue el número si aplica para asegurar la entrega correcta'
                        : 'Please add if applicable to ensure accurate delivery'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-xs text-[#413d3d]/50">{t('address.apartment.note')}</p>
          </div>
        </div>
      </div>
      
      {/* Sticky bottom button */}
      <div className="sticky-bottom-button max-w-md lg:max-w-lg mx-auto w-full">
        <button 
          onClick={handleContinue}
          disabled={!address}
          className="continue-button"
        >
          <span>{t('address.continue')}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Copyright footer */}
        <div className="mt-6 text-center">
          <p className="copyright-text">
            {language === 'es' ? (
              <>
                © 2025 EONPro, LLC. Todos los derechos reservados.<br/>
                Proceso exclusivo y protegido. Copiar o reproducir sin autorización está prohibido.
              </>
            ) : (
              <>
                © 2025 EONPro, LLC. All rights reserved.<br/>
                Exclusive and protected process. Copying or reproduction without authorization is prohibited.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}