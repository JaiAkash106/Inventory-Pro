# Branch Protection Setup Guide

## Main Branch Protection Rules
1. Go to Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable the following:
   - ✓ Require a pull request before merging
   - ✓ Require approvals (at least 1)
   - ✓ Dismiss stale pull request approvals when new commits are pushed
   - ✓ Require status checks to pass before merging
   - ✓ Require branches to be up to date before merging
   - ✓ Status checks that are required:
     - build
     - deploy-production
   - ✓ Include administrators
   - ✓ Allow force pushes (only for administrators)

## Develop Branch Protection Rules
1. Go to Settings → Branches → Add rule
2. Branch name pattern: `develop`
3. Enable the following:
   - ✓ Require a pull request before merging
   - ✓ Require approvals (at least 1)
   - ✓ Require status checks to pass before merging
   - ✓ Status checks that are required:
     - build
     - deploy-preview

## Development Workflow
1. Create feature branches from `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make changes and commit
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. Push feature branch and create PR to develop
   ```bash
   git push origin feature/your-feature-name
   ```

4. After PR is approved and merged to develop, test in staging

5. Create PR from develop to main for production release

## Environment Setup
1. Development (develop branch)
   - Uses preview deployments
   - Connected to development database
   - Feature branches get preview URLs

2. Production (main branch)
   - Uses production deployment
   - Connected to production database
   - Only deploys on merge to main

## Required GitHub Secrets
Add these in GitHub repository Settings → Secrets and variables → Actions:

- `MONGODB_URI`: MongoDB connection string
- `NEXTAUTH_SECRET`: JWT secret key
- `NEXTAUTH_URL`: Authentication callback URL
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `GEMINI_API_KEY`: Gemini AI API key
- `VERCEL_TOKEN`: Vercel deployment token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID
