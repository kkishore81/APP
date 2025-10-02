import React from 'react';

interface AvatarProps {
  name: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, className = '' }) => {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const intToRGB = (i: number) => {
    const c = (i & 0x00FFFFFF).toString(16).toUpperCase();
    return '00000'.substring(0, 6 - c.length) + c;
  };

  const bgColor = intToRGB(hashCode(name));
  const initials = getInitials(name);

  // A simple algorithm to determine if text should be light or dark for contrast
  const getContrastYIQ = (hexcolor: string) => {
    const r = parseInt(hexcolor.substring(0, 2), 16);
    const g = parseInt(hexcolor.substring(2, 4), 16);
    const b = parseInt(hexcolor.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  };

  const textColor = getContrastYIQ(bgColor);

  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold ${className}`}
      style={{ backgroundColor: `#${bgColor}`, color: textColor }}
      aria-label={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;
