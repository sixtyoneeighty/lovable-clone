import { createTheme } from '@mui/material/styles';
import {
  Typography as MuiTypography,
  Button as MuiButton,
  TextField as MuiTextField,
  Avatar as MuiAvatar,
  Box,
  Paper,
  Container,
  Card,
  CardContent,
  Chip,
  IconButton,
  Fab,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Material UI theme with glassy black and red design
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ef4444', // Red
      light: '#f87171',
      dark: '#dc2626',
    },
    secondary: {
      main: '#ff6b6b', // Bright red
      light: '#ff8e8e',
      dark: '#e55555',
    },
    background: {
      default: '#0a0a0a',
      paper: 'rgba(20, 20, 20, 0.8)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
    },
    grey: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#3b82f6',
    },
    success: {
      main: '#10b981',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '12px 24px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
        contained: {
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 1) 0%, rgba(220, 38, 38, 1) 100%)',
            boxShadow: '0 12px 40px rgba(239, 68, 68, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(20, 20, 20, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(20, 20, 20, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            '& fieldset': {
              border: 'none',
            },
            '&:hover': {
              border: '1px solid rgba(239, 68, 68, 0.5)',
            },
            '&.Mui-focused': {
              border: '1px solid rgba(239, 68, 68, 0.8)',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

// Export Material UI components with custom styling
export const Typography = MuiTypography;
export const Button = MuiButton;
export const TextField = MuiTextField;
export const Avatar = MuiAvatar;

// Custom styled components for glassy black and red theme
export const GradientCard = styled(Card)(() => ({
  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  color: 'white',
  '& .MuiCardContent-root': {
    color: 'white',
  },
}));

export const GlassCard = styled(Card)(() => ({
  background: 'rgba(20, 20, 20, 0.6)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
}));

export const AnimatedButton = styled(MuiButton)(() => ({
  transition: 'all 0.3s ease',
  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(239, 68, 68, 0.4)',
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 1) 0%, rgba(220, 38, 38, 1) 100%)',
  },
}));

export const FloatingActionButton = styled(Fab)(() => ({
  position: 'fixed',
  bottom: 24,
  right: 24,
  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 1) 0%, rgba(220, 38, 38, 1) 100%)',
    transform: 'scale(1.05)',
    boxShadow: '0 12px 40px rgba(239, 68, 68, 0.4)',
  },
}));

export const StyledTextField = styled(MuiTextField)(() => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(20, 20, 20, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      border: '1px solid rgba(239, 68, 68, 0.5)',
    },
    '&.Mui-focused': {
      border: '1px solid rgba(239, 68, 68, 0.8)',
      boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
    },
  },
}));

export const FeatureChip = styled(Chip)(() => ({
  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  color: 'white',
  fontWeight: 600,
  '& .MuiChip-deleteIcon': {
    color: 'white',
  },
}));

// Icon component using Material UI icons
export {
  PlayArrow as PlayIcon,
  Favorite as HeartIcon,
  Refresh as RefreshIcon,
  OpenInNew as OpenInNewIcon,
  PhoneAndroid as MobileIcon,
  Tablet as TabletIcon,
  Computer as DesktopIcon,
  AttachFile as PaperclipIcon,
  Send as SendIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  CloudUpload as CloudIcon,
} from '@mui/icons-material';

// Re-export Material UI components for easy access
export {
  Box,
  Paper,
  Container,
  Card,
  CardContent,
  IconButton,
  Fab,
  Chip,
  CircularProgress
};
