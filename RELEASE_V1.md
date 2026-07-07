# JFM v1 Windows Release

This release packages the React/Electron frontend, the Spring Boot backend jar, and a Java 21 runtime into one interactive Windows MSI installer.

## Installer type

v1 uses WiX/MSI instead of Squirrel.

Why:

- Squirrel installs silently under `%LOCALAPPDATA%`.
- WiX/MSI provides a classic Windows installer flow.
- WiX/MSI can default to `C:\Program Files\JFM` and let the user choose a different install directory.

## Final packaged layout

During packaging, Electron Forge copies the frontend `resources` folder outside `app.asar`.

In development:

```text
jfm-frontend/
  resources/
    backend/
      jfm-backend.jar
    runtime/
      bin/
        java.exe
        ffmpeg.exe       # optional; copied from ffmpeg-static when available
    user-config/          # development config/data folder
```

After MSI installation, program files are under the selected install folder, normally:

```text
C:\Program Files\JFM\
  JFM.exe
  resources/
    resources/
      backend/
        jfm-backend.jar
      runtime/
        bin/
          java.exe
          ffmpeg.exe
```

Runtime data is not written to Program Files. It is stored under:

```text
C:\ProgramData\JFM\user-config\
  config.json
  database/
    jfm.db
  covers/
```

The Electron main process starts the backend automatically before opening the app window.

## Database location

For v1, the backend database is created here:

```text
C:\ProgramData\JFM\user-config\database\jfm.db
```

Electron passes this explicit JDBC URL to Spring Boot at startup:

```text
jdbc:sqlite:C:/ProgramData/JFM/user-config/database/jfm.db
```

So the backend no longer depends on a random working directory or `./data` during desktop release.

## Build backend jar

From the backend repo:

```bash
mvn -DskipTests package
```

This creates the Spring Boot jar under:

```text
jfm-backend/target/
```

## Prepare Java runtime

Put a Java 21 runtime into:

```text
jfm-frontend/resources/runtime
```

The required file must exist:

```text
jfm-frontend/resources/runtime/bin/java.exe
```

## Make the installer

From the frontend repo:

```bash
npm install
npm run release:v1
```

The release script will:

1. copy the newest backend jar from `../jfm-backend/target` into `resources/backend/jfm-backend.jar`;
2. verify `resources/runtime/bin/java.exe` exists;
3. copy `ffmpeg-static` into `resources/runtime/bin/ffmpeg.exe` when available;
4. run Electron Forge Windows packaging.

If the backend repo is not next to the frontend repo, pass its location:

```bash
set JFM_BACKEND_DIR=D:\path\to\jfm-backend
npm run release:v1
```

The MSI installer is generated under:

```text
out/make/wix/x64/
```

The expected installer is an `.msi` file.

## User experience

The user runs the MSI installer.

On install:

1. Windows shows a normal installer wizard.
2. The default location is under `C:\Program Files`.
3. The user can choose another install folder.

On app launch:

1. Electron creates `C:\ProgramData\JFM\user-config`.
2. Electron starts bundled `resources/runtime/bin/java.exe`.
3. Java runs `resources/backend/jfm-backend.jar`.
4. Spring Boot listens on `127.0.0.1:8080`.
5. SQLite database is created in `C:\ProgramData\JFM\user-config\database\jfm.db`.
6. React UI talks to `http://localhost:8080`.

## Uninstall old Squirrel build

If an old Squirrel build was installed from `JFM-v1.0.0-Setup.exe`, uninstall it first:

1. Open Windows Settings.
2. Go to Apps > Installed apps.
3. Search for `JFM`.
4. Click Uninstall.

If it does not appear in Settings, remove the old Squirrel install folder manually after closing JFM:

```text
C:\Users\<your-user-name>\AppData\Local\JFM
```

This removes the old Squirrel-installed app. It does not affect the new MSI data folder unless you also delete:

```text
C:\ProgramData\JFM
```
