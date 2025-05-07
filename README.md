# LiVEkiosk

**LiVEkiosk** is a web-based application, which can monitor when YouTube streams/premieres go live and load them accordingly, like a kiosk would.
It also works if a video is provided, in which case it will be loaded instantly.

## Getting Started

1. **Clone** this repository `git clone https://github.com/niilun/LiVEkiosk.git` or download it as an archive, and extract it.

2. Next, install all prerequisites:
    - [**Python**](https://www.python.org/downloads/) - also run `pip install -r requirements.txt` from the root folder to install all requirements.
    - [**NodeJS**](https://nodejs.org/) - then navigate to the `frontend` folder and run `npm install` in a terminal.

3. Now, start both the backend & frontend servers:
    - navigate to the `backend` folder and run the backend server `py`/`python`/`python3` `server.py`. 
    - go to the `frontend` folder and run `npm start` in another terminal.

> **NOTE:** The **backend** runs on `localhost:5000` and the **frontend** on `localhost:3000`

## Customization

- **LiVEkiosk** can be customized by replacing the following files:
    - **watermark**, in `frontend/public/watermark.png` - the watermark placed in the top right of the webpage.
    - **background**, in `frontend/src/background.jpg` - the background image of the whole webpage.
    - **background-info**, in `frontend/src/background-info.png` - the background image of the status box.

> **NOTE:** these can be **images** or **gifs** but NOT **videos**.

## Extra info / Acknowledgments

The backend runs under [**Flask**](https://flask.palletsprojects.com/en/stable/), and the frontend is powered by [**React**](https://react.dev/)

## License

This software is licensed under the [MIT License](https://en.wikipedia.org/wiki/MIT_License).
