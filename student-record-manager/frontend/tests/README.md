# Playwright E2E Tests

## Install

From the `frontend` directory, install dependencies and Chromium:

```powershell
npm install
npx playwright install chromium
```

Python and the Flask dependencies must also be installed in the environment used to run the tests. Install the backend dependencies with `python -m pip install -r ../backend/requirements.txt`. The Playwright config starts `python app.py` from `../backend` and Vite from this directory. Set the `PYTHON` environment variable to an interpreter path when `python` does not resolve to the environment containing Flask. It reuses servers already responding on `http://127.0.0.1:5000` and `http://127.0.0.1:5173` outside CI.

PowerShell example when using a specific Python environment:

```powershell
$env:PYTHON = 'C:\Path\To\Python\python.exe'
```

## Run

Run the suite headlessly:

```powershell
npm run test:e2e
```

Run with a visible Chromium window:

```powershell
npm run test:e2e:headed
```

## Coverage

- Adds a uniquely identified student through the React form, checks the POST status and verifies all displayed table values.
- Creates a unique student through `POST /api/students`, edits it in the UI, and verifies the updated table values and persisted `GET /api/students/<id>` response.
- Each test removes only the student it created; cleanup failures are reported without replacing the primary test result.

The tests use the existing frontend inputs, buttons, and Flask routes. They do not change application logic or operate on pre-existing student records.

## Results

Verified in this workspace with Playwright 1.64.1, Chromium, and Python 3.14.2:

- Headed: `npm run test:e2e:headed` - 2 passed.
- Headless: `npm run test:e2e` - 2 passed.
