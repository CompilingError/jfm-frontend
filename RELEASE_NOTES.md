# Release Notes

## v1.0.0 - Windows Desktop Release

JFM v1.0.0 is the first packaged Windows desktop release of the JFM frontend. It bundles the Electron/React desktop app with the local Spring Boot backend and a Java 21 runtime so the app can run as a local desktop application.

### Highlights

- Added a Windows MSI installer with a classic installation wizard.
- The installer defaults to `C:\Program Files\JFM` and allows choosing another install directory.
- Bundled backend startup into the Electron main process.
- Bundled Java runtime support through `resources/runtime/bin/java.exe`.
- Bundled backend jar support through `resources/backend/jfm-backend.jar`.
- Added optional FFmpeg runtime support for video cover generation.
- Moved packaged app data to `C:\ProgramData\JFM\user-config`.
- SQLite database is created under `C:\ProgramData\JFM\user-config\database\jfm.db`.
- Backend listens locally on `127.0.0.1:8080`.

### User-facing features

- Movie list page with filters and pagination.
- Filter support for name, tags, artists, like status, freshness range, and sorting.
- Tag management page.
- Artist management page.
- Watched-folder configuration.
- Pending review workflow for scanned files.
- Review/import flow for adding local files to the backend database.
- Cached video covers when FFmpeg is available.

### Packaging changes

- Replaced Squirrel installer with WiX/MSI.
- Removed Squirrel startup hook from the Electron main process.
- Added `scripts/prepare-release-v1.mjs` to prepare release assets before packaging.
- Added `RELEASE_V1.md` with build and packaging instructions.
- Updated README with development, release, install, and data-path documentation.

### Build requirements

The Windows MSI release build requires:

- Node.js and npm
- Maven and Java 21 to build the backend jar
- Java 21 runtime copied into `resources/runtime`
- WiX Toolset v3 available in PATH as `candle.exe` and `light.exe`

### Build command

```bash
npm run release:v1
```

MSI output:

```text
out/make/wix/x64/
```

### Notes

The installer and runtime assets are generated locally and should not be committed to git. This includes:

```text
out/
resources/backend/jfm-backend.jar
resources/runtime/
*.msi
*.exe
*.db
```
