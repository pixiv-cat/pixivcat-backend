# Pixiv.cat backend server
This is the backend server for [Pixiv.cat](https://pixiv.cat/), a project that serves as a proxy for Pixiv images.

## Getting Started

### Prerequisites
* Node.js
* npm
* Memcached - For API response caching

### Installing

#### Option 1: Using Docker (Suggested)
1. Clone the repository
   ```
   git clone https://github.com/pixiv-cat/pixivcat-backend.git
   ```
2. Create a `.env` file in the root directory and set up your environment variables based on the provided [.env.example](.env.example).

   To authenticate with Pixiv, you will need to obtain a refresh token (or more than one) from Pixiv.
   
   Please see [here](https://gist.github.com/ZipFile/c9ebedb224406f4f11845ab700124362) for detailed instructions on how to obtain it.
3. Run `docker compose up` to start the server.

#### Option 2: Local Development
1. Clone the repository
   ```
   git clone https://github.com/pixiv-cat/pixivcat-backend.git
   ```
2. Install NPM packages
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and set up your environment variables based on the provided [.env.example](.env.example).

   To authenticate with Pixiv, you will need to obtain a refresh token (or more than one) from Pixiv.
   
   Please see [here](https://gist.github.com/ZipFile/c9ebedb224406f4f11845ab700124362) for detailed instructions on how to obtain it.
5. Start the server
   ```
   npm start
   ```
## License
This project is licensed under the [MIT License](LICENSE).
