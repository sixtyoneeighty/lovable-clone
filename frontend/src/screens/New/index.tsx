import React, { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  Box,
  Container,
  Card,
  CardContent,
  Chip
} from "../../components/ui";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { AttachFile as PaperclipIcon, AutoFixHigh as EnhanceIcon } from '@mui/icons-material';
import {
  RocketLaunch as LandingIcon,
  SportsEsports as GameIcon,
  RecordVoiceOver as VoiceIcon,
  AutoFixHigh as ImageGenIcon
} from '@mui/icons-material';
import Logo from "../../components/Logo";

const StyledCard = styled(Card)(() => ({
  background: 'rgba(20, 20, 20, 0.6)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
}));

const StyledTextField = styled(TextField)(() => ({
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

const TemplateCard = styled(Card)(() => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: 'rgba(20, 20, 20, 0.4)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    background: 'rgba(20, 20, 20, 0.6)',
  },
}));

const NewScreen: React.FC = () => {
  const [input, setInput] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const navigate = useNavigate();

  const handleStartBuilding = () => {
    if (input.trim()) {
      navigate("/create", { state: { initialPrompt: input } });
    }
  };

  const handleEnhancePrompt = async () => {
    if (!input.trim() || isEnhancing) return;

    setIsEnhancing(true);

    try {
      // Simple enhancement using OpenAI-style prompt engineering
      const enhancedPrompt = await enhancePromptLocally(input);
      setInput(enhancedPrompt);
    } catch (error) {
      console.error('Failed to enhance prompt:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  // AI-powered prompt enhancement function
  const enhancePromptLocally = async (prompt: string): Promise<string> => {
    try {
      // Use OpenAI API for intelligent prompt enhancement
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1',
          messages: [
            {
              role: 'system',
              content: `You are a creative web development expert. Transform basic project ideas into detailed, specific prompts for building modern web applications.

Focus on:
🎨 CREATIVE DESIGN: Innovative UI patterns, stunning animations, glassmorphism, gradients, unique layouts
🔥 TECH STACK: React, TypeScript, Vite, Tailwind CSS, Framer Motion animations, responsive design
🗄️ BACKEND NEEDS: Consider if the app needs user authentication, database storage, real-time features, API integrations
🌟 FEATURES: Detailed functionality, user experience, interactive elements, professional polish

IMPORTANT: Return ONLY the enhanced prompt text. No explanations, no quotes, no additional commentary - just the enhanced prompt that can be directly used for development.`
            },
            {
              role: 'user',
              content: `Transform this basic idea into a creative, detailed web development prompt: "${prompt}"`
            }
          ],
          max_tokens: 300,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance prompt');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || prompt;
    } catch (error) {
      console.error('Error enhancing prompt:', error);

      // Fallback to local enhancement if API fails
      const lowerPrompt = prompt.toLowerCase();
      let enhanced = prompt;

      if (!lowerPrompt.includes('responsive')) {
        enhanced = `responsive ${enhanced}`;
      }
      if (!lowerPrompt.includes('modern')) {
        enhanced = `modern ${enhanced}`;
      }

      return `${enhanced}. Include proper navigation, attractive red/black color scheme, smooth transitions, and professional typography.`;
    }
  };

  const templates = [
    { name: "Business Landing", icon: LandingIcon, description: "High-converting landing page with modern animations" },
    { name: "Interactive Game", icon: GameIcon, description: "2-player chess, Pac-Man, or AI vs human games" },
    { name: "Voice AI Agent", icon: VoiceIcon, description: "Real-time voice assistant using TEN Framework" },
    { name: "AI Image Editor", icon: ImageGenIcon, description: "Gemini-powered image generation and editing tool" },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, rgba(239, 68, 68, 0.1) 0%, rgba(0, 0, 0, 0.9) 50%, #000000 100%)',
      py: 4,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ef4444" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        pointerEvents: 'none',
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Logo
              size="xlarge"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.5))',
              }}
            />
          </Box>
          <Typography
            variant="h4"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              mb: 2,
              fontWeight: 300,
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Build. Cool. Shit!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 300
            }}
          >
            Brainstorm. Develop. Deploy.
          </Typography>
        </Box>

        <StyledCard sx={{ mb: 6 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <StyledTextField
                fullWidth
                multiline
                rows={4}
                placeholder="Describe the application you wish to build in as much detail as possible. Include specific features, design preferences, and any other relevant information. The more details, the better!)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleStartBuilding();
                  }
                }}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    icon={<PaperclipIcon />}
                    label="Attach files"
                    variant="outlined"
                    size="small"
                    sx={{
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.7)',
                      '& .MuiChip-icon': { color: 'rgba(255, 255, 255, 0.7)' }
                    }}
                  />
                  <Chip
                    icon={<EnhanceIcon sx={{
                      fontSize: 16,
                      animation: isEnhancing ? 'spin 1s linear infinite' : 'none',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                      }
                    }} />}
                    label={isEnhancing ? "Enhancing..." : "Enhance Prompt"}
                    size="small"
                    onClick={handleEnhancePrompt}
                    disabled={!input.trim() || isEnhancing}
                    sx={{
                      background: isEnhancing
                        ? 'rgba(147, 51, 234, 0.2)'
                        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)',
                      color: 'white',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      cursor: 'pointer',
                      '& .MuiChip-icon': { color: 'white' },
                      '&:hover': {
                        background: isEnhancing
                          ? 'rgba(147, 51, 234, 0.3)'
                          : 'linear-gradient(135deg, rgba(239, 68, 68, 1) 0%, rgba(220, 38, 38, 1) 100%)',
                        transform: 'scale(1.02)',
                      },
                      '&:disabled': {
                        opacity: 0.7,
                        cursor: 'not-allowed',
                        transform: 'none',
                      }
                    }}
                  />
                </Box>
                <Button
                  variant="contained"
                  onClick={handleStartBuilding}
                  disabled={!input.trim()}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 1) 0%, rgba(220, 38, 38, 1) 100%)',
                      boxShadow: '0 12px 40px rgba(239, 68, 68, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: 'rgba(100, 100, 100, 0.3)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  Start Building 🚀
                </Button>
              </Box>
            </Box>
          </CardContent>
        </StyledCard>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 500, color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            Quick Templates
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2 }}>
            {templates.map((template, index) => (
              <TemplateCard
                key={index}
                onClick={() => setInput(`Create a ${template.name.toLowerCase()}: ${template.description}`)}
              >
                <CardContent sx={{ textAlign: 'center', p: 1.5 }}>
                  <Box sx={{ mb: 0.5, display: 'flex', justifyContent: 'center' }}>
                    <template.icon sx={{
                      fontSize: 24,
                      color: 'rgba(239, 68, 68, 0.7)',
                      filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.2))'
                    }} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.25, fontWeight: 600, fontSize: '0.85rem' }}>
                    {template.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', opacity: 0.8 }}>
                    {template.description}
                  </Typography>
                </CardContent>
              </TemplateCard>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default NewScreen;
