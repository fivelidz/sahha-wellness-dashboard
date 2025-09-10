# Sahha EAP Dashboard Demo

A comprehensive Employee Assistance Program (EAP) dashboard integrating Sahha's wellness intelligence API.

## 🚀 Live Demo

Deploy this to Vercel for instant access: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sahha-ai/EAP-DEMO)

## ✨ Features

- **Real-time Wellness Monitoring** - Track employee wellbeing metrics
- **Sahha API Integration** - Connect to real wellness data (57 sandbox profiles)
- **Demo/API Mode Toggle** - Switch between demo and real data
- **Behavioral Intelligence** - Analyze wellness archetypes
- **MCP Documentation** - Full Claude Desktop integration guide
- **Department Analytics** - Compare wellness across teams
- **Risk Detection** - Identify burnout and stress indicators

## 🛠️ Tech Stack

- Next.js 14
- React 18
- TypeScript
- Material-UI
- Sahha API
- Recharts

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/sahha-ai/EAP-DEMO.git
cd EAP-DEMO

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run development server
npm run dev
```

## 🔑 Configuration

The dashboard includes sandbox API credentials for testing:

```env
SAHHA_APP_ID=NqrB0AYlviHruQVbF0Cp5Jch2utzQNwe
SAHHA_CLIENT_ID=tFcIJ0UjCnV9tL7eyUKeW6s8nhIAkjkW
```

These are pre-configured in `vercel.json` for automatic deployment.

## 🌐 Deployment

### Vercel (Recommended)
1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 📊 Dashboard Components

- **Executive Overview** - High-level wellness metrics
- **Profile Management** - Manage employee profiles and API settings
- **Wellness Analytics** - Detailed wellness score analysis
- **Activity Tracking** - Physical activity monitoring
- **Sleep Analysis** - Sleep pattern insights
- **Mental Health** - Mental wellness indicators
- **Behavioral Intelligence** - Sahha archetype analysis
- **MCP Integration** - Claude Desktop connection guide

## 🔗 API Integration

Toggle between Demo and API modes in Profile Management:
1. Navigate to Profile Management
2. Click the Demo/API toggle
3. API mode uses real Sahha sandbox data

## 📝 License

Created for Sahha AI demonstration purposes.

## 🤝 Support

For issues or questions, please contact Sahha support or refer to the in-app documentation.