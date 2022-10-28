# fundraising-app-client

This repository contains the frontend code for the WMDE Fundraising App.

## Running the development server

	npm run serve
	
This will start the development server on port 7072. In your local
development configuration for the Fundraising
Application set the key `assets-path` to `htpp://localhost:7072/` to
redirect all asset requests to the development server.

## Building the assets

The command

	npm run build
	
will create the CSS, JavaScript, fonts and images inside the `dist`
directory. To use them with the Fundraising Application, you must copy
them into the directory `web/skins/laika` in the Fundraising Application
directory. You can ignore or delete the generated HTML files, they are an
unused byproduct of the build process.


## Where to put images and fonts and how to reference them
Put all images, fonts and other non-bundled resources into subdirectories
of the `public` directory. The bundler will automatically copy all
subdirectories into the `dist` directory. When you deploy the application,
the contents of `dist` will become the contents of `/skins/laika`.

### Referencing resources in CSS
Prefix all resources in the `public` directory with `/skins/laika`.
Example: to reference the image
`public/images/logo-vertical-wikimedia.svg` in CSS, use `url(
'/skins/laika/images/logo-vertical-will.svg' )`.

The bundler will preserve all `url()` references as-is.

On your local development machine, you must manually keep the contents of
`dist` (of the fundraising-app-client project) and `web/skins/laika` (of
the fundraising-app prject) in sync, otherwise the CSS references will be
broken.

### Referencing resources in Vue
Prefix  resources in the `public` directory with the variable `assetsPath`.
Example: To show the image
`public/images/logo-vertical-wikimedia.svg` in Vue, use `<img
:src="assetsPath + '/images/logo-vertical-will.svg' )"/>`.

The value of `assetsPath` comes from the `assets-path` data attribute of
the HTML "skeleton" rendered by the PHP templates.
The code in `src/page_data_initializer.ts` sets the variable from the HTML
attribute.


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

