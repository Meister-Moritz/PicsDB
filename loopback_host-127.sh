#!/usr/bin/env bash

gnome-terminal -- bash -l -c "
cd backend
source venv/bin/activate
python3 app.py
exec bash
"

cd frontend
npm run dev -- --host 127.0.0.1
exec bash



