import React from 'react';

interface AvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: string; // e.g., 'w-16 h-16'
}

export const Avatar: React.FC<AvatarProps> = ({ name, photoUrl, size = 'w-16 h-16' }) => {
  // Get initials (e.g., "NEW CLIENT" => "NC")
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`${size} rounded-full object-cover shadow-lg border-2 border-white`}
      />
    );
  }

  return (
    <div
      className={`${size} bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg`}
    >
      {initials}
    </div>
  );
}; 