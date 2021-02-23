# fundraising-app-client

This repository contains the frontend code for the WMDE Fundraising App.

## Running the development server

	npm run serve
	
This will start the development server on port 7072. In your local
development configuration for the Fundraising
Application set the key `assets-path` to `htpp://localhost:7072/` to
redirect all asset requests to the development server.

## Building the assets

	npm run build
	
Will create the CSS, JavaScript, fonts and images inside the `dist`
directory. To use them with the Fundraising Application, you must copy
them into the directory `web/skins/laika` in the Fundraising Application
directory. You can ingnore or delete the generated HTML files, they are an
unused byproduct of the build process.

TODO: Describe how to use the Docker image when we have set up an
automated build on GitLab.
