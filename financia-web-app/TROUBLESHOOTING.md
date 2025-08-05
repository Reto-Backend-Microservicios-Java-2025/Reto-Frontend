# Troubleshooting Guide

## ✅ Fixed Issues

### Environment Configuration Errors
**Problem**: TypeScript errors about missing properties in environment
```
TS2339: Property 'apiUrl' does not exist on type '{}'
TS2339: Property 'endpoints' does not exist on type '{}'
```

**Solution**: The issue was with the `environment.development.ts` file being empty. Fixed by:
1. Adding proper configuration to `environment.development.ts`
2. Creating `environment.interface.ts` for type safety
3. Updating all environment files to use the interface

## 🚨 Common Issues & Solutions

### 1. Development Server Won't Start
**Symptoms**: 
- Build errors on `npm start`
- Missing dependencies

**Solutions**:
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Angular cache
npx ng cache clean

# Check Node.js version (requires 18+)
node --version
```

### 2. Backend Connection Issues
**Symptoms**:
- HTTP errors in browser console
- Authentication failures
- Data not loading

**Solutions**:
- Verify backend services are running on `localhost:8010`
- Check network tab in browser dev tools
- Verify API endpoints in environment files
- Check CORS configuration on backend

### 3. TypeScript Compilation Errors
**Solutions**:
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Update TypeScript if needed
npm update typescript
```

### 4. Angular Material Issues
**Symptoms**:
- Components not displaying correctly
- Missing styles

**Solutions**:
- Verify Angular Material is installed: `npm list @angular/material`
- Check that custom theme is imported in `styles.css`
- Ensure animations are enabled in `app.config.ts`

### 5. Routing Issues
**Symptoms**:
- Pages not loading
- Authentication redirects not working

**Solutions**:
- Check route configuration in `app.routes.ts`
- Verify authentication guard is working
- Check browser console for navigation errors

## 🔧 Development Tips

### Hot Reload Issues
If changes aren't reflecting:
```bash
# Restart dev server
Ctrl+C
npm start
```

### Build for Production
```bash
npm run build
# Files will be in dist/ folder
```

### Debug Mode
Add to `environment.development.ts`:
```typescript
export const environment = {
  // ... existing config
  debug: true,
  logging: true
};
```

## 📞 Getting Help

1. Check browser console for errors
2. Review network tab for API calls
3. Verify backend services are running
4. Check this troubleshooting guide
5. Review Angular CLI documentation

## 🔍 Useful Commands

```bash
# Check versions
ng version
npm list

# Clear everything and reinstall
npm run clean-install

# Build with verbose output
ng build --verbose

# Run with specific port
ng serve --port 4201
```