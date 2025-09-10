'use client';

import React, { useState } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import {
  Settings,
  Refresh,
  Dashboard,
  Analytics,
  Warning,
  TrendingUp,
  People,
  Psychology,
  FitnessCenter,
  Bedtime,
  SentimentSatisfied,
  Battery90,
  Biotech,
  MenuBook,
  Help
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { ExecutiveOverview } from '../dashboard/components/ExecutiveOverview';
import WellbeingAnalytics from '../dashboard/components/WellbeingAnalytics';
import ActivityAnalytics from '../dashboard/components/ActivityAnalytics';
import SleepAnalytics from '../dashboard/components/SleepAnalytics';
import MentalWellbeingAnalytics from '../dashboard/components/MentalHealthAnalytics';
import ReadinessAnalytics from '../dashboard/components/ReadinessAnalytics';
import ProfileManagement from '../dashboard/components/ProfileManagement';
import BehavioralIntelligence from '../dashboard/components/BehavioralIntelligence';
import InstructionalDocs from '../dashboard/components/InstructionalDocs';
import ApiKeyManager from '../dashboard/components/ApiKeyManager';
import { SahhaCredentials } from '../types/sahha';
import { SahhaDataProvider } from '../dashboard/contexts/SahhaDataContext';

// Sahha-themed MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0066CC',
      light: '#4A90E2',
      dark: '#004499',
    },
    secondary: {
      main: '#00AA44',
      light: '#4CAF50',
      dark: '#007A31',
    },
    error: {
      main: '#CC3333',
    },
    warning: {
      main: '#FF9933',
    },
    success: {
      main: '#00AA44',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function EAPDashboard() {
  const [currentTab, setCurrentTab] = useState(0);
  const [apiConfigOpen, setApiConfigOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [credentials, setCredentials] = useState<SahhaCredentials | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Demo organization ID - in real app this would be dynamic
  const orgId = process.env.DEMO_ORG_ID || 'demo_techcorp_industries';

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
    // This would trigger refresh in child components
  };

  const handleCredentialsChange = (newCredentials: SahhaCredentials | null) => {
    setCredentials(newCredentials);
    // This would update the API client configuration
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SahhaDataProvider>
        
        {/* Header */}
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <People sx={{ color: 'primary.main', fontSize: 32 }} />
            <Box>
              <Typography variant="h6" component="div" color="primary">
                Sahha EAP Dashboard
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Employee Assistance Program Analytics
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Help />}
              onClick={() => setShowInstructions(!showInstructions)}
              sx={{ mr: 2 }}
            >
              Dashboard Guide
            </Button>
            
            <Tooltip title="Health Intelligence Guide">
              <IconButton 
                onClick={() => setShowInstructions(!showInstructions)} 
                color={showInstructions ? "primary" : "default"}
              >
                <MenuBook />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh} color="primary">
                <Refresh />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="API Configuration">
              <IconButton onClick={() => setApiConfigOpen(true)} color="primary">
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Tabs */}
      <Paper sx={{ borderRadius: 0 }}>
        <Container maxWidth="xl">
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="dashboard navigation"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              icon={<Dashboard />}
              label="Executive Overview"
              id="dashboard-tab-0"
              aria-controls="dashboard-tabpanel-0"
            />
            <Tab
              icon={<Psychology />}
              label="Wellbeing"
              id="dashboard-tab-1"
              aria-controls="dashboard-tabpanel-1"
            />
            <Tab
              icon={<FitnessCenter />}
              label="Activity"
              id="dashboard-tab-2"
              aria-controls="dashboard-tabpanel-2"
            />
            <Tab
              icon={<Bedtime />}
              label="Sleep"
              id="dashboard-tab-3"
              aria-controls="dashboard-tabpanel-3"
            />
            <Tab
              icon={<SentimentSatisfied />}
              label="Mental Wellbeing"
              id="dashboard-tab-4"
              aria-controls="dashboard-tabpanel-4"
            />
            <Tab
              icon={<Battery90 />}
              label="Readiness"
              id="dashboard-tab-5"
              aria-controls="dashboard-tabpanel-5"
            />
            <Tab
              icon={<People />}
              label="Profile Management"
              id="dashboard-tab-6"
              aria-controls="dashboard-tabpanel-6"
            />
            <Tab
              icon={<Biotech />}
              label="Behavioral Intelligence"
              id="dashboard-tab-7"
              aria-controls="dashboard-tabpanel-7"
            />
          </Tabs>
        </Container>
      </Paper>

      {/* Instructional Documentation */}
      {showInstructions && (
        <Container maxWidth="xl" sx={{ pt: 3 }}>
          <InstructionalDocs onClose={() => setShowInstructions(false)} />
        </Container>
      )}

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <TabPanel value={currentTab} index={0}>
          <ExecutiveOverview orgId={orgId} />
        </TabPanel>
        
        <TabPanel value={currentTab} index={1}>
          <WellbeingAnalytics orgId={orgId} />
        </TabPanel>
        
        <TabPanel value={currentTab} index={2}>
          <ActivityAnalytics orgId={orgId} />
        </TabPanel>
        
        <TabPanel value={currentTab} index={3}>
          <SleepAnalytics orgId={orgId} />
        </TabPanel>
        
        <TabPanel value={currentTab} index={4}>
          <MentalWellbeingAnalytics orgId={orgId} />
        </TabPanel>
        
        <TabPanel value={currentTab} index={5}>
          <ReadinessAnalytics orgId={orgId} />
        </TabPanel>
        
        <TabPanel value={currentTab} index={6}>
          <ProfileManagement orgId={orgId} />
        </TabPanel>
        
        <TabPanel value={currentTab} index={7}>
          <BehavioralIntelligence orgId={orgId} />
        </TabPanel>
      </Container>

      {/* API Configuration Dialog */}
      <ApiKeyManager
        open={apiConfigOpen}
        onClose={() => setApiConfigOpen(false)}
        onCredentialsChange={handleCredentialsChange}
        currentCredentials={credentials}
      />
      </SahhaDataProvider>
    </ThemeProvider>
  );
}