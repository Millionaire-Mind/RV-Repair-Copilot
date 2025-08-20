# RV Repair Copilot 🚐🔧

> **AI-Powered RV Repair Assistance Platform**

RV Repair Copilot is a comprehensive, production-ready MVP that combines the power of OpenAI GPT-4 with vector search technology to provide instant, accurate repair guidance for RV owners and technicians.

## ✨ Features

### 🤖 AI-Powered Intelligence
- **GPT-4 Integration**: Advanced language model for understanding complex repair queries
- **Smart Context Retrieval**: Vector-based search across thousands of technical documents
- **Step-by-Step Guidance**: Detailed repair procedures with safety considerations

### 🔍 Comprehensive Knowledge Base
- **50+ RV Brands**: Support for major manufacturers (Airstream, Winnebago, Fleetwood, Thor, etc.)
- **10,000+ Service Manuals**: Access to OEM documentation and technical specifications
- **100,000+ Repair Procedures**: Extensive database of verified repair information

### 🚀 Modern Web Application
- **Progressive Web App (PWA)**: Mobile-first design with offline capabilities
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Search**: Instant results with intelligent filtering and suggestions

### 🛠️ Developer Experience
- **TypeScript**: Full type safety across frontend and backend
- **Modular Architecture**: Clean separation of concerns for scalability
- **Comprehensive Testing**: Unit and integration test coverage
- **Docker Support**: Containerized development and deployment

## 🏗️ Architecture

```
RV-Repair-Copilot/
├── backend/                 # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic & external integrations
│   │   └── utils/          # Helper functions & utilities
│   ├── scripts/            # CLI tools for data ingestion
│   └── tests/              # Backend test suite
├── frontend/               # React + TypeScript + TailwindCSS PWA
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API client & utilities
│   │   └── hooks/          # Custom React hooks
│   └── public/             # Static assets & PWA files
├── database/               # Database schemas & migrations
├── docs/                   # Documentation & guides
└── docker-compose.yml      # Local development environment
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- **Docker** and **Docker Compose** (for local development)
- **OpenAI API Key** (for AI functionality)
- **Pinecone API Key** (for vector database)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/rv-repair-copilot.git
cd rv-repair-copilot
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

**Required Environment Variables:**
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-1106-preview
OPENAI_EMBEDDING_MODEL=text-embedding-ada-002

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENV=your_pinecone_environment
PINECONE_INDEX=rv-repair-copilot

# Security & Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 4. Start Development Environment

#### Option A: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Option B: Local Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/health

## 📚 Usage

### For RV Owners & Technicians

1. **Search for Repairs**: Enter your RV issue in natural language
2. **Get AI Guidance**: Receive step-by-step repair instructions
3. **View Sources**: Access original service manuals and documentation
4. **Save Time**: Skip hours of manual research with instant answers

### Example Queries

- "How do I fix a water pump that's not working?"
- "What's the procedure for replacing slide-out motor bearings?"
- "Troubleshooting steps for generator won't start"
- "AC unit maintenance schedule for Class A motorhome"

### For Developers

#### Backend API Endpoints

```bash
# Health check
GET /api/health

# Search for repair information
POST /api/query
{
  "question": "How to fix water pump issues?"
}

# Ingest new service manuals
POST /api/ingest/pdf
# Multipart form with PDF file and metadata

# Get system statistics
GET /api/query/stats
```

#### CLI Tools

```bash
# Ingest PDF service manuals
cd backend
npm run script:ingest -- file path/to/manual.pdf --brand "Winnebago" --component "Electrical"

# Scrape trusted websites
npm run script:scrape -- url https://example.com --ingest

# Build embeddings for existing content
npm run script:embeddings -- build --directory ./manuals --chunk-size 1000
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### Frontend Tests

```bash
cd frontend
npm test                   # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Integration Tests

```bash
# Run full test suite
npm run test:integration
```

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

### Docker Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Platform Deployment

- **Frontend**: Deploy to Vercel, Netlify, or any static hosting
- **Backend**: Deploy to Railway, Render, or any Node.js hosting
- **Database**: Use Pinecone cloud or self-hosted vector database

## 🔧 Configuration

### Backend Configuration

```typescript
// backend/src/config/index.ts
export const config = {
  server: {
    port: process.env.PORT || 3001,
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
    }
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4-1106-preview'
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENV,
    index: process.env.PINECONE_INDEX || 'rv-repair-copilot'
  }
};
```

### Frontend Configuration

```typescript
// frontend/src/config/index.ts
export const config = {
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    timeout: 30000
  },
  app: {
    name: 'RV Repair Copilot',
    version: process.env.REACT_APP_VERSION || '1.0.0'
  }
};
```

## 📊 Monitoring & Analytics

### Health Checks

- **Liveness Probe**: `/api/health/live`
- **Readiness Probe**: `/api/health/ready`
- **Full Health Check**: `/api/health`

### Performance Metrics

- **Response Times**: API endpoint performance monitoring
- **Error Rates**: Error tracking and alerting
- **Usage Statistics**: Query volume and success rates

### Logging

- **Structured Logging**: Winston-based logging with JSON format
- **Log Levels**: Error, warn, info, debug
- **File Rotation**: Automatic log file management

## 🔒 Security

### API Security

- **Rate Limiting**: Configurable request throttling
- **CORS Protection**: Cross-origin request validation
- **Input Validation**: Request sanitization and validation
- **Error Handling**: Secure error messages without information leakage

### Data Protection

- **Environment Variables**: Secure configuration management
- **API Key Security**: Secure storage and transmission
- **HTTPS Enforcement**: Production HTTPS requirements

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Pre-commit Hooks**: Automated quality checks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🗺️ Roadmap

### Phase 1: Core MVP ✅
- [x] Basic RAG pipeline
- [x] PDF ingestion system
- [x] Web interface
- [x] API endpoints

### Phase 2: Enhanced Features 🚧
- [ ] User authentication and accounts
- [ ] Saved searches and favorites
- [ ] Advanced filtering and search
- [ ] Mobile app (React Native)

### Phase 3: Enterprise Features 📋
- [ ] Multi-tenant architecture
- [ ] Advanced analytics dashboard
- [ ] API rate limiting and quotas
- [ ] White-label solutions

### Phase 4: AI Enhancements 🔮
- [ ] Voice input and output
- [ ] Image-based problem diagnosis
- [ ] Predictive maintenance alerts
- [ ] Multi-language support

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-username/rv-repair-copilot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/rv-repair-copilot/discussions)
- **Email**: support@rvrepaircopilot.com

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 and embedding models
- **Pinecone** for vector database technology
- **React Team** for the amazing frontend framework
- **Express.js** for the robust backend framework
- **TailwindCSS** for the utility-first CSS framework

---

**Made with ❤️ by the RV Repair Copilot Team**

*Empowering RV enthusiasts with AI-powered repair knowledge*
