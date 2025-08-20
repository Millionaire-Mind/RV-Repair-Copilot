# RV Repair Copilot - Backend API

A production-ready Node.js backend API for the RV Repair Copilot, featuring a RAG (Retrieval-Augmented Generation) pipeline powered by OpenAI GPT-4 and Pinecone vector database.

## 🚀 Features

- **RAG Pipeline**: AI-powered question answering using RV repair manuals
- **Vector Database**: Pinecone integration for semantic search
- **PDF Processing**: Automatic text extraction and chunking
- **Web Scraping**: Trusted OEM and component site content extraction
- **Production Ready**: Comprehensive error handling, logging, and monitoring
- **TypeScript**: Full type safety and modern JavaScript features
- **RESTful API**: Clean, documented endpoints for all operations

## 🏗️ Architecture

```
src/
├── app.ts              # Main Express application
├── routes/             # API route handlers
│   ├── query.ts        # Question processing endpoint
│   ├── ingest.ts       # PDF ingestion endpoint
│   └── health.ts       # Health monitoring endpoints
├── services/           # Core business logic
│   ├── openaiClient.ts # OpenAI API integration
│   ├── vectorDB.ts     # Pinecone vector database
│   └── ragPipeline.ts  # RAG orchestration
└── utils/              # Utility functions
    ├── logger.ts       # Winston logging
    ├── pdfParser.ts    # PDF text extraction
    ├── textChunker.ts  # Text chunking for embeddings
    └── scraper.ts      # Web content scraping
```

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Pinecone API key and environment
- TypeScript knowledge (for development)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RV-Repair-Copilot/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## ⚙️ Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-1106-preview
OPENAI_EMBEDDING_MODEL=text-embedding-ada-002

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENV=your_pinecone_environment
PINECONE_INDEX_NAME=rv-repair-manuals

# Logging
LOG_LEVEL=info
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3001` with hot reloading.

### Production Mode
```bash
npm run build
npm start
```

### Docker (Optional)
```bash
docker build -t rv-repair-copilot-backend .
docker run -p 3001:3001 rv-repair-copilot-backend
```

## 📚 API Endpoints

### Health & Monitoring

#### `GET /health`
Comprehensive health check for all services.

**Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "status": "OK",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0",
  "checks": {
    "database": { "status": "OK", "responseTime": 45 },
    "openai": { "status": "OK", "responseTime": 12 },
    "system": { "status": "OK", "memory": 128, "cpu": { "uptime": 3600 } }
  }
}
```

#### `GET /health/ready`
Kubernetes readiness probe.

#### `GET /health/live`
Kubernetes liveness probe.

#### `GET /health/info`
Detailed system information.

### Query Processing

#### `POST /api/query`
Process RV repair questions through the RAG pipeline.

**Request:**
```json
{
  "question": "How do I troubleshoot a Dometic refrigerator that's not cooling?",
  "brand": "Dometic",
  "component": "refrigerator",
  "manualType": "service"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "Here are the step-by-step troubleshooting steps for your Dometic refrigerator...",
    "sources": ["Dometic Service Manual - Refrigerator", "RV Repair Guide - Cooling Systems"],
    "metadata": {
      "question": "How do I troubleshoot a Dometic refrigerator that's not cooling?",
      "searchResults": 3,
      "processingTime": 2450,
      "modelUsed": "gpt-4-1106-preview"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### `GET /api/query/stats`
Get pipeline statistics.

#### `GET /api/query/health`
Query service health check.

### Content Ingestion

#### `POST /api/ingest/pdf`
Upload and process PDF service manuals.

**Request:** Multipart form data
- `pdf`: PDF file
- `brand`: RV or component brand
- `component`: Component type
- `manualType`: Type of manual (service, owner, parts, wiring)

**Response:**
```json
{
  "success": true,
  "message": "PDF processed and stored successfully",
  "data": {
    "filename": "dometic-refrigerator-manual.pdf",
    "brand": "Dometic",
    "component": "refrigerator",
    "manualType": "service",
    "chunksProcessed": 45,
    "fileSize": 2048576
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### `GET /api/ingest/status`
Get ingestion status and statistics.

#### `DELETE /api/ingest/clear`
Clear vectors by filter criteria.

## 🔧 Development

### Project Structure
- **TypeScript**: Full type safety with strict configuration
- **ESLint**: Code quality and consistency
- **Winston**: Structured logging with file rotation
- **Express**: Fast, unopinionated web framework
- **Multer**: File upload handling
- **Helmet**: Security middleware

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Check code quality
npm run lint:fix     # Fix code quality issues
```

### Adding New Routes
1. Create route file in `src/routes/`
2. Import and register in `src/app.ts`
3. Add proper error handling and validation
4. Include JSDoc documentation

### Adding New Services
1. Create service file in `src/services/`
2. Implement proper error handling
3. Add logging for debugging
4. Export as singleton instance

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Monitoring & Logging

### Log Levels
- **error**: Application errors and failures
- **warn**: Warning conditions
- **info**: General information
- **debug**: Detailed debugging information

### Log Files
- `logs/combined.log`: All logs
- `logs/error.log`: Error logs only

### Health Checks
- **/health**: Comprehensive system health
- **/health/ready**: Kubernetes readiness
- **/health/live**: Kubernetes liveness

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in production.

### Health Checks
The application provides Kubernetes-ready health check endpoints.

### Logging
Configure log levels and file paths for production environments.

### Rate Limiting
Built-in rate limiting (100 requests per 15 minutes per IP).

### Security
- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- File upload restrictions

## 🔒 Security Considerations

- API keys stored in environment variables
- File upload size limits (50MB)
- File type validation (PDF only)
- Rate limiting to prevent abuse
- CORS configuration for frontend access
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information
4. Contact the development team

## 🔮 Roadmap

- [ ] WebSocket support for real-time updates
- [ ] Advanced caching strategies
- [ ] Multi-language support
- [ ] Advanced analytics and metrics
- [ ] Integration with additional AI models
- [ ] Automated testing pipeline
- [ ] Performance optimization
- [ ] Advanced search filters