# Full-Stack TypeScript Monorepo

A full-stack monorepo built with:
- **Backend**: Node.js, Express 5, Mongoose, TypeScript
- **Frontend**: React 19, Vite, TypeScript, Vanilla CSS Modules
- **Package Manager**: pnpm workspaces

## Project Structure
- `server/` - Express + Mongoose REST API
- `client/` - React + Vite frontend

## Prerequisites
- Node.js (v20+ recommended)
- pnpm (v9+)
- MongoDB (running locally on port 27017 or a valid MongoDB URI)

## Installation & Setup

1. **Install dependencies**
   Ensure you are in the root directory and run:
   ```bash
   # This will install dependencies for both the client and server workspaces
   pnpm install
   ```

2. **Configure Environment Variables**
   The project uses `.env` files which are not committed to version control.
   - For the server: Copy `server/.env.example` to `server/.env`
   - For the client: Copy `client/.env.example` to `client/.env`
   
   If you are running MongoDB locally, the defaults should work out of the box.

3. **Start the Database**
   Ensure your local MongoDB instance is running. If you installed it via Homebrew on macOS, you can start it with:
   ```bash
   brew services start mongodb-community
   ```

## Running the Application

To start both the client and server concurrently in development mode, run from the root directory:

```bash
pnpm dev
```

- The **Client** will be available at [http://localhost:5173](http://localhost:5173)
- The **Server API** will be running at [http://localhost:5000/api](http://localhost:5000/api)

Alternatively, you can run them individually:
```bash
# Run only the server
pnpm server:dev

# Run only the client
pnpm client:dev
```
