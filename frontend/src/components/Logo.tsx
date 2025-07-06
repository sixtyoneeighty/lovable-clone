import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  style?: React.CSSProperties;
}

const LogoImage = styled('img')<{ logoSize: string }>(({ theme, logoSize }) => {
  const sizeMap = {
    small: {
      height: '32px',
      maxWidth: '120px'
    },
    medium: {
      height: '48px',
      maxWidth: '180px'
    },
    large: {
      height: '64px',
      maxWidth: '240px'
    },
    xlarge: {
      height: '80px',
      maxWidth: '320px',
      [theme.breakpoints.down('md')]: {
        height: '64px',
        maxWidth: '240px'
      },
      [theme.breakpoints.down('sm')]: {
        height: '48px',
        maxWidth: '180px'
      }
    }
  };

  const currentSize = sizeMap[logoSize as keyof typeof sizeMap] || sizeMap.medium;

  return {
    width: 'auto',
    objectFit: 'contain',
    filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.3))',
    transition: 'all 0.3s ease',
    '&:hover': {
      filter: 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.5))',
      transform: 'scale(1.02)',
    },
    ...currentSize
  };
});

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  className,
  style 
}) => {
  return (
    <Box 
      className={className}
      style={style}
      sx={{ 
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <LogoImage
        src="/logo.png"
        alt="MojoCode"
        logoSize={size}
        loading="eager"
      />
    </Box>
  );
};

export default Logo;
