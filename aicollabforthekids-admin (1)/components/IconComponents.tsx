
import React from 'react';

const iconProps = {
  className: "w-5 h-5",
  strokeWidth: 2,
};

const smallIconProps = {
    className: "w-4 h-4",
    strokeWidth: 2,
};

export const DollarSign = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

export const Rocket = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.11.66-1.76 1.88-3.35 3.48-4.44.64-.45 1.34-.8 2.08-1.07.73-.27 1.49-.4 2.27-.4S18.22 3.65 19 4c1.1.52 2.17 1.22 3.1 2.1.85.79 1.5 1.7 2 2.67.36.7.54 1.47.54 2.23s-.18 1.53-.54 2.23c-.5.97-1.15 1.88-2 2.67-.93.88-2 1.58-3.1 2.1-.8.35-1.6.5-2.4.5s-1.54-.13-2.27-.4c-.74-.27-1.44-.62-2.08-1.07-1.6-1.09-2.82-2.68-3.48-4.44-.65.8-1.1 2.27.05 3.11 1.5 1.77 2 5 2 5s-2.24-1.26-5-2z"></path>
    <path d="M12 12.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0-5 0z"></path>
    <path d="m4.5 16.5-3-3"></path>
    <path d="m19.5 7.5 3-3"></path>
  </svg>
);

export const Target = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
);

export const Users = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

export const TrendingDown = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
      <polyline points="17 18 23 18 23 12"></polyline>
    </svg>
);

export const Calendar = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

export const Aperture = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
        <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
        <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
        <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
        <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
        <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
    </svg>
);

export const LayoutDashboard = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="7" height="9"></rect>
        <rect x="14" y="3" width="7" height="5"></rect>
        <rect x="14" y="12" width="7" height="9"></rect>
        <rect x="3" y="16" width="7" height="5"></rect>
    </svg>
);

export const GitHub = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

export const Search = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

export const Plus = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export const Sparkles = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...smallIconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 3L9.27 9.27L3 12l6.27 2.73L12 21l2.73-6.27L21 12l-6.27-2.73z" />
    </svg>
);

export const MessageSquare = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

export const Send = (props: React.SVGProps<SVGSVGElement>) => (
     <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

export const Sun = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

export const Moon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

export const Mic = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
    </svg>
);

export const Video = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
);

export const VideoOff = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
);

export const MapPin = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

export const Globe = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

export const Menu = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

export const X = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export const ArrowUp = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...smallIconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
);

export const ArrowDown = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...smallIconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
    </svg>
);

export const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
);

export const Mail = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

export const Server = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
        <line x1="6" y1="6" x2="6.01" y2="6"></line>
        <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
);

export const Terminal = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="4 17 10 11 4 5"></polyline>
        <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
);

export const ClipboardList = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        <path d="M9 14l2 2 4-4"></path>
    </svg>
);

export const ShieldCheck = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
    </svg>
);

export const ShieldAlert = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

export const Share = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
        <polyline points="16 6 12 2 8 6"></polyline>
        <line x1="12" y1="2" x2="12" y2="15"></line>
    </svg>
);

export const Trash = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

export const Lock = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

export const Unlock = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
    </svg>
);

export const RefreshCw = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
);

export const GitBranch = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="6" y1="3" x2="6" y2="15"></line>
        <circle cx="18" cy="6" r="3"></circle>
        <circle cx="6" cy="18" r="3"></circle>
        <path d="M18 9a9 9 0 0 1-9 9"></path>
    </svg>
);

export const UploadCloud = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="16 16 12 12 8 16"></polyline>
        <line x1="12" y1="12" x2="12" y2="21"></line>
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
        <polyline points="16 16 12 12 8 16"></polyline>
    </svg>
);

export const DownloadCloud = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="8 17 12 21 16 17"></polyline>
        <line x1="12" y1="12" x2="12" y2="21"></line>
        <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>
    </svg>
);

export const GitCommit = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="4"></circle>
        <line x1="1.05" y1="12" x2="7" y2="12"></line>
        <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
    </svg>
);

export const GitMerge = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="18" cy="18" r="3"></circle>
        <circle cx="6" cy="6" r="3"></circle>
        <path d="M6 21V9a9 9 0 0 0 9 9"></path>
    </svg>
);

export const Paperclip = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
    </svg>
);

export const Brain = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
    </svg>
);

export const Image = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
);

export const Film = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
        <line x1="7" y1="2" x2="7" y2="22"></line>
        <line x1="17" y1="2" x2="17" y2="22"></line>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <line x1="2" y1="7" x2="7" y2="7"></line>
        <line x1="2" y1="17" x2="7" y2="17"></line>
        <line x1="17" y1="17" x2="22" y2="17"></line>
        <line x1="17" y1="7" x2="22" y2="7"></line>
    </svg>
);

export const Wand = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M15 4l-2 6.5L6.5 12 13 13.5 15 20l2-6.5L23.5 12 17 10.5 15 4z"></path>
    </svg>
);

export const Layers = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
    </svg>
);

export const BookOpen = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);

export const Palette = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 2.69l5.74 5.88a5.99 5.99 0 0 1-8.48 8.48 16.1 16.1 0 0 1-5.48-5.48 5.99 5.99 0 0 1 8.22-8.88z"></path>
        <line x1="12" y1="2.69" x2="12" y2="16"></line>
    </svg>
);

export const Headphones = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
    </svg>
);

export const Smile = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
    </svg>
);

export const Megaphone = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 11l19-9-9 19-2-8-8-2z"></path>
    </svg>
);

export const CheckCircle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export const Heart = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);

export const HeartHandshake = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.18 0l2.9 2.69" />
    </svg>
);

export const Play = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);

export const Pause = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
);

export const ShoppingBag = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
);

export const ShoppingCart = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

export const CloudLightning = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path>
        <polyline points="13 11 9 17 15 17 11 23"></polyline>
    </svg>
);

export const Cpu = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
        <rect x="9" y="9" width="6" height="6"></rect>
        <line x1="9" y1="1" x2="9" y2="4"></line>
        <line x1="15" y1="1" x2="15" y2="4"></line>
        <line x1="9" y1="20" x2="9" y2="23"></line>
        <line x1="15" y1="20" x2="15" y2="23"></line>
        <line x1="20" y1="9" x2="23" y2="9"></line>
        <line x1="20" y1="15" x2="23" y2="15"></line>
        <line x1="1" y1="9" x2="4" y2="9"></line>
        <line x1="1" y1="15" x2="4" y2="15"></line>
    </svg>
);

export const Shirt = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M20.38 3.4a2 2 0 0 0-1.2-1.1 19.9 19.9 0 0 0-14.36 0 2 2 0 0 0-1.2 1.1L2 8l4 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10l4-2-1.62-4.6z"></path>
        <path d="M8 10l-2.34-1.17"></path>
        <path d="M16 10l2.34-1.17"></path>
        <path d="M12 2v4"></path>
    </svg>
);

export const CreditCard = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
);

export const Compass = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
    </svg>
);

export const Download = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

export const Printer = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2-2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
    </svg>
);

export const FileText = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

export const FileAudio = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M17.5 22h.5c.5 0 1-.5 1-1v-9c0-.5-.5-1-1-1h-3c-.5 0-1 .5-1 1v9c0 .5.5 1 1 1h.5"></path>
        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
        <path d="M8 18v-6"></path>
        <path d="M5 16v-2"></path>
        <path d="M11 16v-2"></path>
    </svg>
);

export const FileImage = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

export const UserCheck = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <polyline points="17 11 19 13 23 9"></polyline>
    </svg>
);

export const Ban = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
    </svg>
);

export const Gem = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M6 3h12l4 6-10 13L2 9z"></path>
    </svg>
);

export const Activity = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
);

export const FileJson = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <path d="M10 12a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1"></path>
        <path d="M14 16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
        <path d="M7 12v4"></path>
        <path d="M17 12v4"></path>
    </svg>
);

export const Upload = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

export const Drive = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M15 2H9a1 1 0 0 0-.8.4l-7 12a1 1 0 0 0 .8 1.6h6a1 1 0 0 0 .8-.4l7-12a1 1 0 0 0-.8-1.6z"></path>
    <path d="M15 22h6a1 1 0 0 0 .8-1.6l-7-12a1 1 0 0 0-1.6 0l-3 5.2"></path>
    <path d="M6.5 16.5l-3 5.2a1 1 0 0 0 .8 1.6h12a1 1 0 0 0 .8-1.6l-3-5.2"></path>
  </svg>
);

export const Sheets = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="8" y1="13" x2="16" y2="13"></line>
    <line x1="8" y1="17" x2="16" y2="17"></line>
    <line x1="10" y1="9" x2="8" y2="9"></line>
  </svg>
);

export const Folder = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

export const Save = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

export const Layout = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
);

export const RotateCcw = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="1 4 1 10 7 10"></polyline>
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
    </svg>
);

export const ArrowLeft = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

export const ArrowRight = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

export const Shield = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

export const AlertTriangle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

export const CheckSquare = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="9 11 12 14 22 4"></polyline>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
);

export const Vote = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M9 12l2 2 4-4"></path>
        <circle cx="12" cy="12" r="10"></circle>
    </svg>
);

export const PieChart = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
    </svg>
);

export const Info = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

export const Zap = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);

export const Radio = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="2"></circle>
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
    </svg>
);

export const Speaker = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <circle cx="12" cy="14" r="4"></circle>
        <line x1="12" y1="6" x2="12.01" y2="6"></line>
    </svg>
);

export const Smartphone = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>
);

export const QrCode = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);

export const Copy = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

export const Package = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
);

export const Feather = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
        <line x1="16" y1="8" x2="2" y2="22"></line>
        <line x1="17.5" y1="15" x2="9" y2="15"></line>
    </svg>
);

export const Award = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="8" r="7"></circle>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
    </svg>
);
