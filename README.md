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

## Using the Docker image to run the server and build assets

The name of the Docker image is `registry.gitlab.com/fun-tech/fundraising-app-frontend`

To run the development server:

	docker run --rm -p 7072:7072 registry.gitlab.com/fun-tech/fundraising-app-frontend
	
To build the assets and copy them to a location, run the following 3
commands (adapting the example path of
`~/src/fundraising-app/web/skins/laika` to your actual path)

	docker run --name frontend-build registry.gitlab.com/fun-tech/fundraising-app-frontend npm run build
	docker cp frontend-build:/app/dist/.  ~/src/fundraising-app/web/skins/laika
	docker rm frontend-build

These 3 commands will build the assets *inside* the docker image, copy them out of the
stopped image and then delete the stopped image. There are other ways get
the files, but this method has the benfit that the copied
files will have the right owner (the user who copied the files).

