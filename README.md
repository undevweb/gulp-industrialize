# gulp-industrialize

With gulp-industrialize you can easily deploy your project to the production. Run gulp prepare-deploiement will minify all your project in the folder gulp/deploiement. Then you have just to run  gulp deploy --env production to deploy the minified sources in production.

## Configuration

Donwload this project and copy it to the root of your project. npm install the dependencies from the package.json.
Go in gulp and rename config.dist in config. Go inside config and customize your environment : 

   - project.json //title, description, appName of your website
   - sources.json //paths of the sources must go in production
   - deploy.json //credentials of your ftp