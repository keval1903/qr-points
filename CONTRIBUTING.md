# Contributing to QR Points Redemption System

Thank you for your interest in contributing! 🎉

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/YOUR_USERNAME/qr-points/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS, etc.)

### Suggesting Features

1. Open an issue with the "enhancement" label
2. Describe the feature and its benefits
3. Provide examples or mockups if possible

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages: `git commit -m "Add amazing feature"`
6. Push to your fork: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Use consistent indentation (2 spaces)
- Follow existing code patterns
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names

### Testing

Before submitting:
- Test locally with `npm run dev`
- Test all redemption flows
- Test dashboard functionality
- Check responsive design
- Verify error handling

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/qr-points.git
cd qr-points

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

## Project Structure

```
qr-points-redemption/
├── public/              # Frontend files
├── netlify/functions/   # Backend serverless functions
├── .github/workflows/   # CI/CD configuration
└── docs/               # Documentation
```

## Questions?

Feel free to ask questions in:
- GitHub Discussions
- Issue comments
- Pull Request comments

Thank you for contributing! 🚀
