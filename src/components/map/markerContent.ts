import { Instructor, Company } from '@/types';

export function createInstructorMarkerContent(
  instructor: Instructor, 
  isSelected: boolean
): HTMLDivElement {
  const isVerified = instructor.verified?.cnh && instructor.verified?.criminalRecord;

  const markerContent = document.createElement('div');
  markerContent.innerHTML = `
    <div class="relative group cursor-pointer transform transition-all duration-300 ${isSelected ? 'scale-110 z-50' : 'hover:scale-105'}">
      <!-- Glow effect -->
      <div class="absolute -inset-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? 'opacity-100' : ''}"
           style="background: radial-gradient(circle, rgba(20, 184, 166, 0.4) 0%, transparent 70%);"></div>
      
      <!-- Main marker -->
      <div class="relative">
        <!-- Avatar container -->
        <div class="relative w-14 h-14 rounded-full overflow-hidden shadow-2xl transition-all duration-300"
             style="
               border: 3px solid ${isSelected ? '#14b8a6' : 'rgba(255,255,255,0.9)'};
               box-shadow: ${isSelected 
                 ? '0 0 0 4px rgba(20, 184, 166, 0.3), 0 8px 32px rgba(0,0,0,0.5)' 
                 : '0 8px 32px rgba(0,0,0,0.4)'};
             ">
          <img 
            src="${instructor.avatar}" 
            alt="${instructor.name}"
            class="w-full h-full object-cover"
          />
        </div>
        
        <!-- Price badge -->
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-white font-bold whitespace-nowrap shadow-lg"
             style="
               background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
               font-size: 11px;
               letter-spacing: 0.3px;
             ">
          R$${instructor.pricePerHour}
        </div>
        
        <!-- Verified badge -->
        ${isVerified ? `
          <div class="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
               style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border: 2px solid white;">
            <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        ` : ''}
        
        <!-- Rating indicator -->
        <div class="absolute -top-1 -left-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full shadow-lg"
             style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(255,255,255,0.2);">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="#fbbf24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span class="text-white font-semibold" style="font-size: 9px;">${instructor.rating}</span>
        </div>
      </div>
    </div>
  `;

  return markerContent;
}

export function createSchoolMarkerContent(school: Company): HTMLDivElement {
  const markerContent = document.createElement('div');
  markerContent.innerHTML = `
    <div class="relative group cursor-pointer transform transition-all duration-300 hover:scale-105">
      <!-- Glow effect -->
      <div class="absolute -inset-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
           style="background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);"></div>
      
      <!-- Main marker -->
      <div class="relative">
        <!-- Building icon container -->
        <div class="relative w-14 h-14 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 flex items-center justify-center"
             style="
               background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
               border: 3px solid rgba(255,255,255,0.9);
               box-shadow: 0 8px 32px rgba(0,0,0,0.4);
             ">
          ${school.logo 
            ? `<img src="${school.logo}" alt="${school.name}" class="w-full h-full object-cover" />`
            : `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
               </svg>`
          }
        </div>
        
        <!-- School badge -->
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-white font-bold whitespace-nowrap shadow-lg"
             style="
               background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
               font-size: 10px;
               letter-spacing: 0.3px;
             ">
          Autoescola
        </div>
        
        <!-- Verified badge -->
        ${school.verified ? `
          <div class="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
               style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border: 2px solid white;">
            <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        ` : ''}
        
        <!-- Rating indicator -->
        <div class="absolute -top-1 -left-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full shadow-lg"
             style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(255,255,255,0.2);">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="#fbbf24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span class="text-white font-semibold" style="font-size: 9px;">${school.rating}</span>
        </div>
      </div>
    </div>
  `;

  return markerContent;
}

export function createUserLocationMarker(): HTMLDivElement {
  const userMarkerContent = document.createElement('div');
  userMarkerContent.innerHTML = `
    <div class="relative">
      <div class="absolute -inset-4 bg-accent/20 rounded-full animate-ping"></div>
      <div class="relative w-4 h-4 bg-accent rounded-full border-2 border-white shadow-lg"></div>
    </div>
  `;
  return userMarkerContent;
}
