#!/usr/bin/env bash
myIP=$(hostname -I | awk '{print $1}')
gnome-terminal -- bash -l -c "
cd backend
source venv/bin/activate
python3 app.py 0.0.0.0
exec bash
"

myIP=$(hostname -I | awk '{print $1}')
cd frontend
npm run dev -- --host $myIP
exec bash


