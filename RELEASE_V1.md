# JFM v1 Windows Release

This release packages the React/Electron frontend, the Spring Boot backend jar, and a Java 21 runtime into one Windows installer.

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
    user-config/          # development config/data folder
```

After installation:

```text
<install-folder>/
  JFM.exe
  user-config/
    config.json
    database/
      jfm.db
  resources/
    resources/
      backend/
        jfm-backend.jar
      runtime/
        bin/
          java.exe
```

The Electron main process starts the backend automatically before opening the app window.

## Database location

For v1, the backend database is created here:

```text
<install-folder>/user-config/database/jfm.db
```

Electron passes this explicit JDBC URL to Spring Boot at startup:

```text
jdbc:sqlite:<install-folder>/user-config/database/jfm.db
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
3. run Electron Forge Windows packaging.

If the backend repo is not next to the frontend repo, pass its location:

```bash
set JFM_BACKEND_DIR=D:\path\to\jfm-backend
npm run release:v1
```

The installer is generated under:

```text
out/make/squirrel.windows/x64/
```

The expected installer name is:

```text
JFM-v1.0.0-Setup.exe
```

## User experience

The user only needs to run the installer, then open JFM.

On app launch:

1. Electron creates `user-config` beside `JFM.exe`.
2. Electron starts bundled `resources/runtime/bin/java.exe`.
3. Java runs `resources/backend/jfm-backend.jar`.
4. Spring Boot listens on `127.0.0.1:8080`.
5. SQLite database is created in `user-config/database/jfm.db`.
6. React UI talks to `http://localhost:8080`.
