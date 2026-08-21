# KOBANI Tours frontend deployment

The production frontend uses the shared backend mounted at:

```text
https://www.cytechdevhub.com/kobani/api
```

Set this build-time environment variable on the frontend host:

```dotenv
VITE_KOBANI_API_BASE_URL=https://www.cytechdevhub.com/kobani/api
```

Build with `pnpm install --frozen-lockfile` followed by `pnpm run build`, publish the `dist` directory, and configure SPA fallback routing so unknown paths serve `index.html`. The current production hostname is `https://kobani-tours-cytechrts.onrender.com` and it must appear in the backend's `KOBANI_FRONTEND_ORIGINS` value. The custom hostname may remain as an additional allowed origin for later activation.

After deploying, verify:

```text
https://www.cytechdevhub.com/kobani/api/health
https://kobani-tours-cytechrts.onrender.com/login
https://kobani-tours-cytechrts.onrender.com/customer/bookings
```

Authentication uses secure HTTP-only cookies. Both sites must remain on HTTPS, and frontend API requests must keep credentials enabled.
