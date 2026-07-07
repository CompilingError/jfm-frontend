# JFM Frontend

JFM Frontend is the Windows desktop client for the JFM local media management system. It is built with Electron, React, and Vite, and it works with the local Spring Boot backend from `jfm-backend`.

The v1 desktop release packages the frontend, backend jar, Java runtime, and optional FFmpeg runtime into one Windows MSI installer.

## Features

- Movie library page with pagination and filtering.
- Filter by name, tags, artists, like status, freshness range, and sort order.
- Tag management and artist management pages.
- Local watched-folder settings managed by Electron.
- Pending review workflow for newly scanned files.
- Review modal for editing imported file metadata before saving to the backend.
- Bundled backend startup from the Electron main process.
- SQLite desktop database configured through the backend startup environment.
- Video cover generation through bundled FFmpeg when available.

## Tech stack

- Electron 43
- React 19
- Vite
- Electron Forge
- WiX/MSI for the Windows release installer
- Local Spring Boot backend at `http://localhost:8080`

## Repository layout

```text
jfm-frontend/
  src/
    main.js                    # Electron main process
    preload.js                 # Safe renderer API bridge
    main/
      ipc/                     # IPC handlers
      services/                # Local settings, scanning, backend process, covers
    renderer/                  # React application
  scripts/
    prepare-release-v1.mjs     # Copies backend jar and validates runtime assets
  resources/                   # Local release assets; ignored by git
    backend/
      jfm-backend.jar
    runtime/
      bin/
        java.exe
        ffmpeg.exe
```

## Development

### Prerequisites

- Node.js and npm
- A running local JFM backend, or the backend repository available locally
- Java 21 and Maven for building the backend

### Install frontend dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run start
```

In development, the renderer talks to:

```text
http://localhost:8080
```

Local frontend settings are stored under:

```text
jfm-frontend/user-config
```

## Windows v1 release build

### 1. Build the backend jar

From the backend repository:

```bash
mvn -DskipTests package
```

This produces the backend jar under:

```text
jfm-backend/target/
```

### 2. Prepare the Java runtime

Place a Java 21 runtime under:

```text
jfm-frontend/resources/runtime
```

The release script requires:

```text
jfm-frontend/resources/runtime/bin/java.exe
```

### 3. Install WiX Toolset

The MSI release uses WiX. The local machine must have WiX v3 tools available in PATH:

```text
candle.exe
light.exe
```

Typical WiX v3 path:

```text
C:\Program Files (x86)\WiX Toolset v3.14\bin
```

Check from a new terminal:

```powershell
where.exe candle.exe
where.exe light.exe
```

### 4. Build the MSI installer

From the frontend repository:

```bash
npm run release:v1
```

The release script will:

1. copy the newest backend jar from `../jfm-backend/target` to `resources/backend/jfm-backend.jar`;
2. verify that `resources/runtime/bin/java.exe` exists;
3. copy `ffmpeg-static` to `resources/runtime/bin/ffmpeg.exe` when available;
4. run Electron Forge packaging and WiX MSI creation.

If the backend repository is not next to the frontend repository, pass its path:

```bash
set JFM_BACKEND_DIR=D:\path\to\jfm-backend
npm run release:v1
```

The MSI output is generated under:

```text
out/make/wix/x64/
```

## Installed layout

The MSI installer uses a classic Windows installation flow and allows the user to choose the install directory.

Default program location:

```text
C:\Program Files\JFM
```

Runtime user data is not written to Program Files. It is stored under:

```text
C:\ProgramData\JFM\user-config
```

Expected runtime data:

```text
C:\ProgramData\JFM\user-config\config.json
C:\ProgramData\JFM\user-config\database\jfm.db
C:\ProgramData\JFM\user-config\covers\
```

## Runtime behavior

When JFM starts in packaged mode:

1. Electron creates or loads the user config folder.
2. Electron starts the bundled Java runtime.
3. Java runs the bundled Spring Boot backend jar.
4. The backend listens on `127.0.0.1:8080`.
5. Electron passes the SQLite database path to the backend.
6. The React renderer talks to the backend over HTTP.

## Files that should not be committed

The following are local build/runtime artifacts and should stay out of git:

```text
resources/backend/jfm-backend.jar
resources/runtime/
resources/user-config/
out/
node_modules/
*.msi
*.exe
*.db
```

## Related repository

Backend repository:

```text
https://github.com/CompilingError/jfm-backend
```
