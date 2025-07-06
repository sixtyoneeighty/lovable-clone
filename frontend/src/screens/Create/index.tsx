import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  TextField,
  Box,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Paper,
  CircularProgress
} from "../../components/ui";
import {
  RefreshIcon,
  OpenInNewIcon,
  MobileIcon,
  TabletIcon,
  DesktopIcon,
  PlayIcon,
  SendIcon
} from "../../components/ui";
import {
  AutoFixHigh as EnhanceIcon,
  Code as CodeIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useLocation } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { useWebSocket } from "../../hooks/useWebSocket";
import { MessageType } from "../../types/messages";
import Logo from "../../components/Logo";

const IframeContainer = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const ChatContainer = styled(Paper)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(20, 20, 20, 0.8)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const MessageBubble = styled(Box)<{ isUser: boolean }>(({ theme, isUser }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: 16,
  marginBottom: theme.spacing(1),
  maxWidth: '80%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  background: isUser
    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)'
    : 'rgba(40, 40, 40, 0.8)',
  backdropFilter: 'blur(10px)',
  border: isUser
    ? '1px solid rgba(239, 68, 68, 0.3)'
    : '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
}));

const DeviceButton = styled(IconButton)<{ active: boolean }>(({ theme, active }) => ({
  background: active
    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)'
    : 'rgba(40, 40, 40, 0.6)',
  backdropFilter: 'blur(10px)',
  border: active
    ? '1px solid rgba(239, 68, 68, 0.3)'
    : '1px solid rgba(255, 255, 255, 0.1)',
  color: active ? 'white' : theme.palette.text.secondary,
  '&:hover': {
    background: active
      ? 'linear-gradient(135deg, rgba(239, 68, 68, 1) 0%, rgba(220, 38, 38, 1) 100%)'
      : 'rgba(60, 60, 60, 0.8)',
    transform: 'scale(1.05)',
  },
}));

const CreateScreen: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // WebSocket connection
  const wsUrl = import.meta.env.VITE_BEAM_WS_URL || '';
  const wsToken = import.meta.env.VITE_BEAM_TOKEN || '';

  console.log('Environment variables:', { wsUrl, wsToken: wsToken ? 'SET' : 'NOT SET' });

  const { isConnected, messages, sendMessage, error } = useWebSocket({
    url: wsUrl,
    token: wsToken,
    onMessage: (message) => {
      console.log('Received message:', message);

      // Handle different message types
      if (message.type === MessageType.UPDATE_FILE && message.data?.url) {
        setIframeUrl(message.data.url);
        setIframeReady(true);
        setIframeError(false);
      } else if (message.type === MessageType.ERROR) {
        setIframeError(true);
        console.error('Agent error:', message.data?.error);
      }
    },
    onConnect: () => {
      console.log('Connected to MojoCode agent');
    },
    onDisconnect: () => {
      console.log('Disconnected from MojoCode agent');
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
    }
  });

  const handleSendMessage = () => {
    if (inputMessage.trim() && isConnected) {
      try {
        sendMessage(MessageType.USER, {
          text: inputMessage,
          sender: 'USER'
        });
        setInputMessage("");
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleEnhancePrompt = async () => {
    if (!inputMessage.trim() || isEnhancing) return;

    setIsEnhancing(true);

    try {
      // Enhanced prompt using local enhancement for now
      const enhanced = await enhancePromptLocally(inputMessage);
      setInputMessage(enhanced);
    } catch (error) {
      console.error('Failed to enhance prompt:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  // AI-powered prompt enhancement function
  const enhancePromptLocally = async (prompt: string): Promise<string> => {
    try {
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
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const enhancedText = data.choices[0]?.message?.content;

      if (enhancedText) {
        return enhancedText.trim();
      }

      throw new Error('No enhanced text received');
    } catch (error) {
      console.error('Error enhancing prompt with OpenAI:', error);

      // Fallback to local enhancement if API fails
      const lowerPrompt = prompt.toLowerCase();
      let enhanced = prompt;

      if (!lowerPrompt.includes('responsive')) {
        enhanced = `responsive ${enhanced}`;
      }

      if (!lowerPrompt.includes('modern')) {
        enhanced = `modern ${enhanced}`;
      }

    // Add specific technical requirements
    const technicalDetails = [];

    // Modern creative templates
    if (lowerPrompt.includes('landing') || lowerPrompt.includes('business')) {
      technicalDetails.push("with hero section, testimonials, pricing tables, contact forms, and conversion-optimized CTAs");
    }

    if (lowerPrompt.includes('game') || lowerPrompt.includes('chess') || lowerPrompt.includes('pacman') || lowerPrompt.includes('interactive')) {
      technicalDetails.push("with real-time gameplay, smooth animations, score tracking, responsive controls, and AI opponents");
    }

    if (lowerPrompt.includes('voice') || lowerPrompt.includes('ai agent') || lowerPrompt.includes('ten framework')) {
      technicalDetails.push("with real-time voice processing, speech-to-text, text-to-speech, and WebRTC integration");
    }

    if (lowerPrompt.includes('image') || lowerPrompt.includes('gemini') || lowerPrompt.includes('editor') || lowerPrompt.includes('generation')) {
      technicalDetails.push("with drag-and-drop upload, real-time editing tools, AI-powered generation, and Google Gemini API integration");
    }

    // Legacy templates
    if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('admin')) {
      technicalDetails.push("with data visualization components, charts, and analytics features");
    }

    if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('store') || lowerPrompt.includes('shop')) {
      technicalDetails.push("with product catalog, shopping cart, checkout process, and payment integration");
    }

    if (lowerPrompt.includes('blog') || lowerPrompt.includes('content')) {
      technicalDetails.push("with content management system, article layouts, and search functionality");
    }

    if (lowerPrompt.includes('portfolio')) {
      technicalDetails.push("with project showcases, image galleries, and contact forms");
    }

      // Combine everything
      const finalPrompt = `${enhanced}${technicalDetails.length > 0 ? ' ' + technicalDetails.join(', ') : ''}. Include proper navigation, attractive color scheme matching the red/black theme, smooth transitions, and professional typography.`;

      return finalPrompt;
    }
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const initialPrompt = location.state?.initialPrompt;
    if (initialPrompt && isConnected) {
      try {
        sendMessage(MessageType.USER, {
          text: initialPrompt,
          sender: 'USER'
        });
      } catch (error) {
        console.error('Failed to send initial prompt:', error);
      }
    }
  }, [location.state, isConnected, sendMessage]);

  const LoadingState = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 3 }}>
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={80} sx={{ color: 'rgba(239, 68, 68, 0.8)' }} />
        <Box
          component="img"
          src="/mojo.jpg"
          alt="MojoCode"
          sx={{
            position: 'absolute',
            width: 48,
            height: 48,
            borderRadius: '50%',
            objectFit: 'cover',
            filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))'
          }}
        />
      </Box>
      <Typography variant="h6" color="text.secondary">
        Connecting to Workspace...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 400 }}>
        Please wait while we setup your workspace and load the website.
      </Typography>
    </Box>
  );

  const ErrorState = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 3 }}>
      <ErrorIcon sx={{ fontSize: 64, color: 'error.main' }} />
      <Typography variant="h6" color="text.secondary">
        Generation Failed
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 400 }}>
        Unable to generate your application. Please try again or check your connection.
      </Typography>
    </Box>
  );

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'radial-gradient(ellipse at top, rgba(239, 68, 68, 0.1) 0%, rgba(0, 0, 0, 0.9) 50%, #000000 100%)',
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
      {/* Subtle corner watermark */}
      <Box
        component="img"
        src="/mojo.jpg"
        alt=""
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          width: 32,
          height: 32,
          borderRadius: '50%',
          opacity: 0.1,
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'grayscale(100%)',
        }}
      />

      {/* Header */}
      <Paper sx={{
        p: 2,
        borderRadius: 0,
        background: 'rgba(20, 20, 20, 0.9)',
        backdropFilter: 'blur(20px)',
        border: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 2
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo size="small" />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <DeviceButton active={selectedDevice === "mobile"} onClick={() => setSelectedDevice("mobile")}>
              <MobileIcon />
            </DeviceButton>
            <DeviceButton active={selectedDevice === "tablet"} onClick={() => setSelectedDevice("tablet")}>
              <TabletIcon />
            </DeviceButton>
            <DeviceButton active={selectedDevice === "desktop"} onClick={() => setSelectedDevice("desktop")}>
              <DesktopIcon />
            </DeviceButton>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', gap: 2, p: 2, position: 'relative', zIndex: 1 }}>
        {/* Preview Panel */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{
            height: '100%',
            background: 'rgba(20, 20, 20, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <CardContent sx={{ p: 2, height: '100%' }}>
              {/* URL Bar */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
                p: 1,
                background: 'rgba(40, 40, 40, 0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: 1,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <IconButton
                  size="small"
                  disabled={!iframeUrl}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444'
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
                <TextField
                  size="small"
                  fullWidth
                  value={iframeUrl || ""}
                  slotProps={{ input: { readOnly: true } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(20, 20, 20, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      '& fieldset': { border: 'none' }
                    }
                  }}
                />
                <IconButton
                  size="small"
                  component="a"
                  href={iframeUrl || undefined}
                  target="_blank"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444'
                    }
                  }}
                >
                  <OpenInNewIcon />
                </IconButton>
              </Box>

              {/* Preview Area */}
              <IframeContainer sx={{ height: 'calc(100% - 80px)' }}>
                {!iframeUrl ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 3 }}>
                    <CodeIcon sx={{
                      fontSize: 64,
                      color: 'rgba(239, 68, 68, 0.8)',
                      filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.3))'
                    }} />
                    <Typography variant="h6" sx={{ color: 'white' }}>Ready to Build Cool Shit</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PlayIcon sx={{ color: 'rgba(239, 68, 68, 0.7)' }} />
                        <Typography variant="body2" color="text.secondary">Send a message to start coding</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RefreshIcon sx={{ color: 'rgba(239, 68, 68, 0.7)' }} />
                        <Typography variant="body2" color="text.secondary">Live preview updates</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CodeIcon sx={{ color: 'rgba(239, 68, 68, 0.7)' }} />
                        <Typography variant="body2" color="text.secondary">AI-powered development</Typography>
                      </Box>
                    </Box>
                  </Box>
                ) : iframeError ? (
                  <ErrorState />
                ) : !iframeReady ? (
                  <LoadingState />
                ) : (
                  <iframe
                    src={iframeUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  />
                )}
              </IframeContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Chat Panel */}
        <Box sx={{ width: 400 }}>
          <ChatContainer>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src="/mojo.jpg"
                  alt="MojoCode Assistant"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    fontWeight: 700,
                    '& img': {
                      objectFit: 'cover'
                    }
                  }}
                >
                  M
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>
                    MojoCode
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isConnected ? "#10b981" : "rgba(255, 255, 255, 0.5)",
                      fontWeight: 500
                    }}
                  >
                    {isConnected ? "Connected" : "Connecting..."}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Messages */}
            <Box ref={chatHistoryRef} sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
              {messages.map((msg, index) => (
                <MessageBubble key={index} isUser={msg.data?.sender === 'USER'}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {msg.data?.text || msg.data?.error || 'Message'}
                  </Typography>
                </MessageBubble>
              ))}
              {messages.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {isConnected ? 'Start a conversation with the AI assistant' : 'Connecting to MojoCode agent...'}
                  </Typography>
                </Box>
              )}
              {error && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" color="error">
                    Connection error: {error}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Input */}
            <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(40, 40, 40, 0.6)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      '& fieldset': { border: 'none' },
                      '&:hover': {
                        border: '1px solid rgba(239, 68, 68, 0.5)',
                      },
                      '&.Mui-focused': {
                        border: '1px solid rgba(239, 68, 68, 0.8)',
                        boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
                      },
                    }
                  }}
                />
                <IconButton
                  onClick={handleEnhancePrompt}
                  disabled={!inputMessage.trim() || isEnhancing}
                  title="Enhance prompt with AI"
                  sx={{
                    background: 'rgba(147, 51, 234, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(147, 51, 234, 0.3)',
                    color: 'rgba(147, 51, 234, 0.9)',
                    '&:hover': {
                      background: 'rgba(147, 51, 234, 0.3)',
                      transform: 'scale(1.05)',
                      boxShadow: '0 0 15px rgba(147, 51, 234, 0.4)',
                    },
                    '&:disabled': {
                      background: 'rgba(100, 100, 100, 0.3)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  <EnhanceIcon sx={{
                    fontSize: 18,
                    animation: isEnhancing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }} />
                </IconButton>
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || !isConnected}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 1) 0%, rgba(220, 38, 38, 1) 100%)',
                      transform: 'scale(1.05)',
                    },
                    '&:disabled': {
                      background: 'rgba(100, 100, 100, 0.3)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </ChatContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateScreen;
