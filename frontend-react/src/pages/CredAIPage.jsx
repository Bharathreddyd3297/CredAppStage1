import { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { extractErrorMessage, sendAiChatMessage } from '../services/api';
import { glassCard, goldGradient } from '../theme/theme';

const QUICK_ACTIONS = [
  { emoji: '🏥', label: 'Cluster Health', prompt: 'How is my cluster?' },
  { emoji: '💳', label: 'Payment Summary', prompt: 'Summarize payment activity today.' },
  { emoji: '🚀', label: 'Deployment Analysis', prompt: 'Explain the latest deployment.' },
  { emoji: '📈', label: 'Capacity Planning', prompt: 'Any resource bottlenecks?' },
  { emoji: '📊', label: 'Business Metrics', prompt: "Summarize today's business metrics." },
  { emoji: '⚙️', label: 'Pod Health', prompt: 'Show unhealthy pods.' },
  { emoji: '🔥', label: 'High CPU', prompt: 'Which deployment consumes the highest CPU?' },
  { emoji: '🧠', label: 'Root Cause Analysis', prompt: 'Why is payment-service slow?' },
];

const SUGGESTED_QUESTIONS = [
  'How is my cluster?',
  'Why is payment-service slow?',
  'Show unhealthy pods.',
  'How many successful payments happened today?',
  'Is Azure healthy?',
];

const WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    "Hi, I'm **CredAI** — CredPay's AI Operations Assistant. Ask me about cluster health, " +
    'deployments, payments, or anything else happening in the platform right now.',
};

function TypingIndicator() {
  return (
    <Box sx={{ display: 'flex', gap: 0.7, alignItems: 'center', px: 0.5, py: 0.5 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: goldGradient,
            animation: 'floatShine 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </Box>
  );
}

function MessageBubble({ role, content }) {
  const isUser = role === 'user';
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ justifyContent: isUser ? 'flex-end' : 'flex-start', mb: 2.5 }}
    >
      {!isUser && (
        <Avatar sx={{ width: 32, height: 32, background: goldGradient, flexShrink: 0 }}>
          <SmartToyRoundedIcon fontSize="small" sx={{ color: '#0A0A0B' }} />
        </Avatar>
      )}
      <Box
        sx={{
          maxWidth: '78%',
          px: 2,
          py: 1.3,
          borderRadius: 3,
          ...(isUser
            ? { background: goldGradient, color: '#0A0A0B' }
            : { ...glassCard, color: 'text.primary' }),
        }}
      >
        {isUser ? (
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{content}</Typography>
        ) : (
          <Box
            sx={{
              '& p': { m: 0, mb: 1 },
              '& p:last-child': { mb: 0 },
              '& ul, & ol': { mt: 0, mb: 1, pl: 3 },
              '& table': { width: '100%', borderCollapse: 'collapse', my: 1 },
              '& th, & td': {
                border: '1px solid rgba(255,255,255,0.12)',
                px: 1,
                py: 0.5,
                fontSize: 14,
              },
              '& code': {
                fontFamily: 'monospace',
                fontSize: 13,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 1,
                px: 0.6,
                py: 0.1,
              },
              '& pre': {
                background: 'rgba(0,0,0,0.35)',
                borderRadius: 2,
                p: 1.5,
                overflowX: 'auto',
              },
              '& pre code': { background: 'none', p: 0 },
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </Box>
        )}
      </Box>
      {isUser && (
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <PersonRoundedIcon fontSize="small" />
        </Avatar>
      )}
    </Stack>
  );
}

export default function CredAIPage() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollAnchorRef = useRef(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  async function handleSend(overrideText) {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    const history = messages
      .filter((m) => m !== WELCOME_MESSAGE)
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const data = await sendAiChatMessage({ message: text, history });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(extractErrorMessage(err, 'CredAI could not respond. Please try again.'));
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <Box sx={{ animation: 'fadeInUp .5s ease both' }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h3"
          sx={{
            background: goldGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
          }}
        >
          🤖 CredAI
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your AI Operations Assistant
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left sidebar: quick actions + suggested questions */}
        <Grid item xs={12} md={3}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                  Quick Actions
                </Typography>
                <Stack spacing={1}>
                  {QUICK_ACTIONS.map((action) => (
                    <Box
                      key={action.label}
                      onClick={() => handleSend(action.prompt)}
                      sx={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.08)',
                        transition: 'all .15s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          background: 'rgba(200,162,75,0.08)',
                        },
                      }}
                    >
                      <Typography sx={{ fontSize: 20, lineHeight: 1 }}>{action.emoji}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {action.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                  Suggested Questions
                </Typography>
                <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <Chip
                      key={question}
                      label={question}
                      onClick={() => handleSend(question)}
                      sx={{
                        height: 'auto',
                        py: 1,
                        maxWidth: '100%',
                        '& .MuiChip-label': { whiteSpace: 'normal', display: 'block' },
                      }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Main chat column */}
        <Grid item xs={12} md={9}>
          <Card sx={{ display: 'flex', flexDirection: 'column', height: '72vh', minHeight: 480 }}>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
              {messages.map((message, index) => (
                <MessageBubble key={index} role={message.role} content={message.content} />
              ))}
              {loading && (
                <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }}>
                  <Avatar sx={{ width: 32, height: 32, background: goldGradient, flexShrink: 0 }}>
                    <SmartToyRoundedIcon fontSize="small" sx={{ color: '#0A0A0B' }} />
                  </Avatar>
                  <Box sx={{ ...glassCard, px: 2, py: 1.3, borderRadius: 3 }}>
                    <TypingIndicator />
                  </Box>
                </Stack>
              )}
              <div ref={scrollAnchorRef} />
            </Box>

            {error && (
              <Typography color="error" variant="body2" sx={{ px: 3, pb: 1 }}>
                {error}
              </Typography>
            )}

            <Divider />
            <Box sx={{ p: 2, display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Ask CredAI about your cluster, deployments, or payments..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <IconButton
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                sx={{
                  background: goldGradient,
                  color: '#0A0A0B',
                  '&:hover': { opacity: 0.9 },
                  '&.Mui-disabled': { opacity: 0.35, color: '#0A0A0B' },
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: '#0A0A0B' }} /> : <SendRoundedIcon />}
              </IconButton>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
