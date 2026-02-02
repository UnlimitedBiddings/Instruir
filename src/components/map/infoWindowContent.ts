import { Instructor, Company } from '@/types';

export function createInstructorInfoWindowContent(instructor: Instructor): string {
  const isVerified = instructor.verified?.cnh && instructor.verified?.criminalRecord;
  const isFromSchool = instructor.providerType === 'company';
  
  return `
    <div style="
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: 16px;
      padding: 16px;
      min-width: 280px;
      max-width: 320px;
      color: white;
      font-family: 'Inter', sans-serif;
      border: 1px solid rgba(255,255,255,0.1);
    ">
      <div style="display: flex; gap: 12px; align-items: flex-start;">
        <img 
          src="${instructor.avatar}" 
          alt="${instructor.name}"
          style="
            width: 56px;
            height: 56px;
            border-radius: 12px;
            object-fit: cover;
            border: 2px solid ${isFromSchool ? '#3b82f6' : '#14b8a6'};
          "
        />
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="font-weight: 700; font-size: 15px; color: white;">${instructor.name}</span>
            ${isVerified ? `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFromSchool ? '#3b82f6' : '#14b8a6'}">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            ` : ''}
          </div>
          ${isFromSchool ? `
            <div style="display: inline-block; background: rgba(59, 130, 246, 0.2); color: #60a5fa; font-size: 10px; padding: 2px 8px; border-radius: 4px; margin-bottom: 6px;">
              Autoescola
            </div>
          ` : ''}
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span style="color: #fbbf24; font-weight: 600; font-size: 13px;">${instructor.rating}</span>
            <span style="color: #94a3b8; font-size: 12px;">(${instructor.reviewCount} avaliações)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; color: #94a3b8; font-size: 12px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <path d="m16 8 5 3-5 3V8Z"/>
            </svg>
            <span>${instructor.vehicle?.model || 'Veículo'}</span>
            <span style="margin: 0 4px;">•</span>
            <span>${instructor.vehicle?.transmission === 'automatic' ? 'Automático' : 'Manual'}</span>
          </div>
        </div>
      </div>
      
      <div style="
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid rgba(255,255,255,0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <div>
          <span style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Preço/hora</span>
          <div style="font-size: 20px; font-weight: 800; color: ${isFromSchool ? '#3b82f6' : '#14b8a6'};">R$ ${instructor.pricePerHour}</div>
        </div>
        <button 
          onclick="window.location.href='/instructor/${instructor.id}'"
          style="
            background: linear-gradient(135deg, ${isFromSchool ? '#3b82f6' : '#14b8a6'} 0%, ${isFromSchool ? '#2563eb' : '#0d9488'} 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
          "
        >
          Ver Perfil
        </button>
      </div>
    </div>
  `;
}

export function createSchoolInfoWindowContent(school: Company): string {
  const instructorCount = school.professionalIds?.length || 0;
  
  return `
    <div style="
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: 16px;
      padding: 16px;
      min-width: 280px;
      max-width: 320px;
      color: white;
      font-family: 'Inter', sans-serif;
      border: 1px solid rgba(255,255,255,0.1);
    ">
      <div style="display: flex; gap: 12px; align-items: flex-start;">
        <div style="
          width: 56px;
          height: 56px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #3b82f6;
          background: #1e293b;
        ">
          ${school.logo ? `<img src="${school.logo}" alt="${school.name}" style="width: 100%; height: 100%; object-fit: cover;" />` : ''}
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="display: inline-block; background: rgba(59, 130, 246, 0.2); color: #60a5fa; font-size: 10px; padding: 2px 8px; border-radius: 4px; margin-bottom: 6px;">
            Autoescola
          </div>
          <div style="font-weight: 700; font-size: 15px; color: white; margin-bottom: 4px;">${school.name}</div>
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span style="color: #fbbf24; font-weight: 600; font-size: 13px;">${school.rating}</span>
            <span style="color: #94a3b8; font-size: 12px;">(${school.reviewCount} avaliações)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; color: #94a3b8; font-size: 12px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <span>${instructorCount} instrutores disponíveis</span>
          </div>
        </div>
      </div>
      
      <div style="
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid rgba(255,255,255,0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <div>
          <span style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Pacotes a partir de</span>
          <div style="font-size: 20px; font-weight: 800; color: #3b82f6;">R$ ${school.packages?.[0]?.priceTotal || 750}</div>
        </div>
        <button 
          onclick="window.location.href='/school/${school.id}'"
          style="
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
          "
        >
          Ver Pacotes
        </button>
      </div>
    </div>
  `;
}
