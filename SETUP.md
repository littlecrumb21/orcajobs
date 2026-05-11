# Orca Jobs — Setup Guide

## Stack
- **Next.js 15** (App Router, TypeScript)
- **PostgreSQL** via **Prisma** ORM
- **NextAuth.js v5** — email/password authentication
- **Stripe** — job posting payments (tiered: £29 / £59 / £99)
- **AWS S3** — CV and logo file uploads
- **Resend** — transactional email
- Deployable to **Vercel** or **AWS Amplify**

---

## 1. Prerequisites

- Node.js 20+
- A PostgreSQL database (see options below)
- A [Stripe account](https://stripe.com)
- An [AWS account](https://aws.amazon.com) (for S3)
- A [Resend account](https://resend.com) (free tier: 3,000 emails/month)

---

## 2. Database options

### Option A — Neon (easiest, free tier)
1. Go to [neon.tech](https://neon.tech) and create a project
2. Copy the connection string (PostgreSQL format)
3. Set `DATABASE_URL` in your `.env.local`

### Option B — AWS RDS PostgreSQL
1. Create an RDS PostgreSQL instance in the AWS console
2. Set it to the same region as your Amplify deployment
3. Connection string: `postgresql://user:password@your-endpoint:5432/orca_jobs`

### Option C — Local (development only)
```bash
# Using Docker:
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=orca_jobs postgres:16
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/orca_jobs"
```

---

## 3. Environment variables

```bash
cp .env.example .env.local
```

Fill in each variable in `.env.local`. See `.env.example` for descriptions.

---

## 4. Stripe setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. In the Stripe Dashboard, go to **Products** and create three products:
   - **Basic** — £29 one-time payment
   - **Featured** — £59 one-time payment
   - **Premium** — £99 one-time payment
3. Copy each price ID (`price_xxx`) into your `.env.local`
4. For the webhook (needed for job activation after payment):
   - Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
   - Local dev: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
   - Production: Add webhook in Stripe Dashboard → Developers → Webhooks
   - Event to listen for: `checkout.session.completed`

---

## 5. AWS S3 setup

1. Create an S3 bucket (e.g. `orca-jobs-uploads`)
2. Set bucket region to `eu-west-2` (London) — closest to Isle of Wight
3. Create an IAM user with S3 permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Effect": "Allow",
       "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
       "Resource": "arn:aws:s3:::orca-jobs-uploads/*"
     }]
   }
   ```
4. Create access keys for that IAM user
5. Add the keys to `.env.local`
6. Set bucket CORS policy (for direct uploads from browser):
   ```json
   [{"AllowedOrigins": ["http://localhost:3000", "https://your-domain.com"],
     "AllowedMethods": ["PUT", "GET"],
     "AllowedHeaders": ["*"]}]
   ```

---

## 6. Resend email setup

1. Create account at [resend.com](https://resend.com)
2. Verify your sending domain (or use their sandbox for testing)
3. Create an API key and add to `.env.local` as `RESEND_API_KEY`
4. Set `EMAIL_FROM` to your verified sender (e.g. `Orca Jobs <hello@orca.jobs>`)

---

## 7. First run

```bash
# Install dependencies
npm install

# Push schema to database and generate Prisma client
npm run db:push

# Seed with demo data (admin user + sample jobs)
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Admin login:** `admin@orca.jobs` / `admin-change-me-123`
*(Change this immediately via the database or add a settings page)*

---

## 8. Deployment

### Vercel (recommended for simplicity)
```bash
npm install -g vercel
vercel
# Follow prompts — add environment variables in the Vercel dashboard
# Run: vercel env pull .env.local after deploying
```

For production DB, use Neon or set DATABASE_URL to your RDS instance. Add all env vars in Vercel's project settings.

### AWS Amplify
1. Push this repo to GitHub
2. Go to AWS Amplify Console → New app → Host web app → Connect GitHub
3. Select the repo — Amplify will detect `amplify.yml` automatically
4. Set all environment variables in Amplify → App settings → Environment variables
5. Deploy

The `amplify.yml` in this repo handles: `npm ci` → `prisma generate` → `prisma migrate deploy` → `next build`.

---

## 9. First things after deploying

1. **Change the admin password** — update `admin@orca.jobs` via Prisma Studio (`npm run db:studio`) or create a settings page
2. **Set up your domain** — point your DNS to Vercel/Amplify and update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`
3. **Create Stripe products** — the pricing is mocked until you add real Stripe Price IDs
4. **Verify your email domain** in Resend before going live
5. **Register with the ICO** as a data controller (required under UK GDPR, £40–60/yr)

---

## Regulatory notes (UK)

- **ICO registration** required (as you process personal data): [ico.org.uk/registration](https://ico.org.uk/registration)
- **Employment Agencies Act 1973** — you may not charge candidates for job-finding services
- **GDPR data deletion requests** are surfaced in the admin panel and must be processed within 30 days
- The site includes a GDPR consent flow on signup, a privacy centre, and data retention settings
