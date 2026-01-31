# Hospital CRM - Setup Guide

## Quick Start Checklist

Follow these steps after cloning the repository:

- [ ] Install Node.js (v18+)
- [ ] Install MongoDB or get MongoDB Atlas URI
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Update `.env` with your MongoDB URI and secrets
- [ ] Run `npm run seed` to populate database
- [ ] Run `npm run dev` to start the server
- [ ] Login with demo credentials

## Default Login Credentials

After running the seed script, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Doctor | doctor@medicore.com | a |
| Patient | patient@medicore.com | a |
| Admin | admin@medicore.com | a |
| Nurse | nurse@medicore.com | a |
| Front Desk | frontdesk@medicore.com | a |
| Lab Tech | lab@medicore.com | a |
| Pharmacist | pharmacy@medicore.com | a |
| Billing | billing@medicore.com | a |

## Important Notes

1. **Use 127.0.0.1 instead of localhost** in `NEXTAUTH_URL` to prevent IPv6 issues
2. **Change default passwords** after initial setup for security
3. **Never commit `.env`** file to version control
4. The `public/uploads/` directory is excluded from git but structure is preserved

## Troubleshooting

### "Cannot connect to MongoDB"
- Check if MongoDB is running locally: `mongod --version`
- Verify your `MONGODB_URI` in `.env`
- For Atlas, check network access whitelist

### "NextAuth CLIENT_FETCH_ERROR"
- Ensure `NEXTAUTH_URL="http://127.0.0.1:3000"` (not localhost)
- Restart the dev server after changing `.env`
- Clear browser cookies

### "Module not found" errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Run `npm run dev`

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
