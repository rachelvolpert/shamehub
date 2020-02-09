# shamehub

## Premise
A commonly overlooked fact is that when it comes to sustainability, reduce is the first R. Many of us find ourselves making unwise environmental or financial decisions when we use rideshare apps instead of T-ing, walking or biking. Or when we go on a frenzied online shopping spree as if we are an unstoppable force and a $10 shirt from Zaful is a very movable object. Whatever the bad habits may be, we want to help folks break them through powerful forces of social pressure and .... SHAME. Shamehub connects to your bank cards and displays purchases in categories you deem shameful for all of your friends to see and shame your for! 

## Technology Stack
- Python3 - backend
- Node.js - backend
- PostgreSQL - database
- Ionic with React - frontend
- Plaid API - manage connections to credit/debit cards

## Development

To set up environment in `backend`:
ENSURE THAT YOU ARE USING PYTHON3

`python3 -m venv venv` (if the venv folder does not exist)
`. venv/bin/activate`
`pip install -r requirements.txt`
`export DATABASE_HOST=localhost`
`export DATABASE_NAME=shamehublocal`
`export DATABASE_USER=$USER`
`flask run` or `python app.py`

To set up environment in `front-end`:
`npm install`
`ionic serve`
