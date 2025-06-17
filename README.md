# Legal Ally 🏛️

**Making legal understanding accessible to everyone through AI-powered document management and analysis.**

---

## 🌟 Overview

Legal Ally is a comprehensive legal document platform that combines artificial intelligence with intuitive design to democratize legal document creation, analysis, and management. Whether you're a legal professional, small business owner, or individual seeking legal clarity, our platform provides the tools and insights you need.

## ✨ Key Features

### 📄 **Intelligent Document Creation**
- **Pre-built Templates**: Professionally crafted templates for common legal documents
- **AI-Guided Form Filling**: Smart assistance that helps you complete documents correctly
- **Multi-Format Support**: Create various document types including:
  - Employee Service Agreements
  - Non-Disclosure Agreements (NDAs)
  - Legal Notices
  - Civil Suit Documents
  - Contract Templates
  - Legal Correspondence

### 🔍 **Advanced Document Analysis**
- **AI-Powered Insights**: Comprehensive analysis using state-of-the-art language models
- **Statute Identification**: Automatically identify relevant laws and regulations
- **Semantic Segmentation**: Break down complex legal language into understandable segments
- **Judgment Prediction**: AI-assisted prediction of potential case outcomes
- **Case Law Analysis**: Cross-reference with relevant precedents and case law
- **Risk Assessment**: Identify potential legal risks and compliance issues

### 📰 **Personalized Legal News Hub**
- **Curated News Feed**: Stay updated with relevant legal developments
- **Smart Filtering**: Tag-based filtering system for personalized content
- **Real-time Updates**: Get instant notifications on important legal changes
- **Industry-Specific News**: Filter by practice areas and jurisdictions

### ✍️ **Professional Text Editor**
- **Version Control**: Track document changes and maintain revision history
- **Multi-Format Export**: Export to PDF, DOC, and other formats
- **Digital Signatures**: Secure electronic signature integration


### 🔐 **Security & Compliance**
- **User Authentication**: Secure login with Clerk authentication
- **Privacy Protection**: GDPR and privacy regulation compliant
- **Audit Trail**: Complete activity logging for compliance requirements

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18+ with Vite for lightning-fast development |
| **UI Framework** | Radix UI components with Tailwind CSS styling |
| **Data Visualization** | Chart.js for analytics and reporting |
| **AI Engine** | Google Generative AI (Gemini) for intelligent analysis |
| **Authentication** | Clerk for secure user management |
| **Document Processing** | React Doc Viewer for multi-format support |
| **State Management** | React Context API with custom hooks |

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.0 or higher) 
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/legal_ally.git
   cd legalassist-ai
   ```

2. **Navigate to the client directory**
   ```bash
   cd client
   ```

3. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Or using yarn
   yarn install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys and configuration:
   ```env
   VITE_GOOGLE_AI_API_KEY=your_gemini_api_key
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running.



