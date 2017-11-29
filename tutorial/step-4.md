# 4. Deploy code to Amazon Lambda, Create API Gateway, and Upload static files to S3
This should take care of all of the networking requirements.
You will now need create a new Lambda function with the project code.

## Deploy code to Lambda
Go to [Lambda Home](https://console.aws.amazon.com/lambda/home) and click ‘Create a Lambda function’.
For the blueprint select ‘Blank Function’.
For the trigger, click the gray dashed box and select ‘Cloudwatch Events - Schedule’.
Name the trigger whatever you want.
The schedule expression can be whatever you want as well; ‘cron(0 17 ? * MON-SUN *)’ will run the function once a day at 17:00 UTC.
The documentation for schedule expressions can be found [here](http://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html).

Name the function something and set the runtime to Node.js 6.10.
For Code Entry Type click the dropdown and select ‘Upload a .ZIP file’, then click on the Upload button that appears and then navigate to and select the bitscoop-data-science-demo-<version>.zip file.
The Handler should be ‘index.handler’.
For the role, select the role that you created earlier.

You will need to add several Environment Variables, with the number depending on how many services you wish to run. You will always need to add the following variables:

* BITSCOOP_API_KEY (obtainable at https://bitscoop.com/keys)
* PORT (by default it’s 3306)
* HOST (the endpoint for the RDS box, <Box name>.<ID>.<Region>.rds.amazonaws.com)
* USER (the username you picked for the RDS box)
* PASSWORD (the password you set for the RDS box)
* DATABASE (the database name you set for the RDS box)

If you are getting data from GitHub, you will need to add these:

* GITHUB_MAP_ID (The ID of the BitScoop API map you created for GitHub)
* GITHUB_USER (the username that owns the repo you’re interested in)
* GITHUB_REPO (the name of the repo you’re interested in)

If you are getting data from Google Analytics, you will need to add these:

* GOOGLE_MAP_ID (The ID of the BitScoop API map you created for Google)
* GOOGLE_GA_VIEW_ID (the ID of the View you are monitoring)
* GOOGLE_CONNECTION_ID (the ID of the BitScoop Connection you created to the Google Analytics API Map)

If you are getting data from StatusCake, you will need to add these:

* STATUSCAKE_MAP_ID (The ID of the BitScoop API map you created for StatusCake)
* STATUSCAKE_TEST_ID (the ID of the Test you are monitoring)

If you are getting data from Postman, you will need to add these:

* POSTMAN_MAP_ID (The ID of the BitScoop API map you created for Postman)
* POSTMAN_MONITOR_ID (the ID of the Monitor you are running)

Open the Advanced Settings accordion.
You’ll probably want to set the Timeout to 10 seconds.
Under VPC select the ‘bitscoop-demo’ VPC.
For Subnets add the two ‘private’ subnets, and for the Security Group select ‘lambda’ one we created.
Hit next and you’ll be taken to a review screen, and then select ‘Create Function’ at the very bottom of the page.

If you did not set a trigger earlier, go to the details for the function and click the tab ‘Triggers’. Click ‘Add Trigger’, click on the dashed gray box, then ‘Cloudwatch Events - Schedule’. See above for the remaining steps to set up a scheduled trigger. Then click Submit.

Your Lambda function should be good to go.

## Create API Gateway
Next we will create an API gateway to handle traffic to the endpoint that will serve up the formatted data.
Go to the [API Gateway home](https://console.aws.amazon.com/apigateway/home) and click Get Started.
Name the API whatever you want; for reference purposes we’ll call it ‘stack-data’.
Make sure the type is ‘New API’ and then click Create.

You should be taken to the API you just created.
Click on the Resources link if you aren’t there already.
Highlight the resource ‘/’ (it should be the only one present), click on the Actions dropdown and select ‘Create Method’.
Click on the blank dropdown that appears and select the method ‘GET’, then click the checkbox next to it.
Make sure the Integration Type is ‘Lambda Function’.
Leave ‘Use Lambda Proxy integration’ unchecked, select the region your Lambda function is in, and enter the name of that Lambda function, then click Save.
Accept the request to give the API gateway permission to access the Lambda function.

Click on the ‘GET’ method, and to the right you should see a flowchart with four boxes positioned between a ‘client’ box and a ‘lambda’ box.
Click on ‘Method Request’.
Add two URL Query String Parameters ‘endDate’ and ‘startDate’, making sure to click the checkbox after entering the names to save them.
Neither is required.

Go back to Method Execution (either through the link or by clicking on the method again) and click on ‘Integration Request’.
Open the Body Mapping Templates accordion and click on the middle radio button for Request body passthrough (‘When there are no templates defined (recommended)’).
Click on Add Mapping Template and enter ‘application/json’ into the box that appears, the click the checkbox.
In the code window that appears enter

```
{
    "startDate": "$input.params('startDate')",
    "endDate": "$input.params('endDate')"
}
```

and click Save.
This passes the parameters sent to the API call to fields on the event that’s passed to the Lambda function.

The final thing to do is get the URL at which this API is available.
Click ‘Stages’ on the far left, underneath the ‘Resources’ of this API.
By default a ‘prod’ stage has been created, so click on that.
The URL should be shown as the ‘Invoke URL’ in the top middle of the page on a blue background.

You need to copy this URL into a file before deploying the code to S3.
In the project, go to static/js/site.js.
Near the top of the file you should see `var apiUrl = ‘’;`
Paste the Invoke URL into the quotes.
Navigate to the top level of the project and run

```
gulp build
```

to compile and package all of the static files to the dist/ folder.

## Deploy static files to S3
Lastly, we’re going to create an S3 bucket to host our site. Go to [S3](https://console.aws.amazon.com/s3/home) and create a new bucket.
Give it a name and select the region that’s closest to you, then click Next.
You can leave Versioning, Logging, and Tags disabled, so click Next.
Open the ‘Manage Group Permissions’ accordion and give Everyone Read access to Objects (NOT Object Permissions).
Click Next, review everything, then click Create Bucket.

Click on the Bucket in the list.
Go to the Properties tab and click on Static Website Hosting.
Take note of the Endpoint url at the top of this box, as that is the url you will hit to see the demo page in action.
Select ‘Use this bucket to host a website’ and enter ‘index.html’ for the Index Document (you should leave the Error Document blank), then click Save.

Go to the Objects tab and click Upload to have a modal appear.
Click Add Files in this modal and navigate to the ‘dist’ directory in the bitscoop-data-visualizer-demo directory, then into the directory below that (it’s a unix timestamp of when the build process was completed).
Move the file system window so that you can see the Upload modal.
Click and drag the static folder and the index.html file over the Upload modal (S3 requires that you drag-and-drop folders, and this only works in Chrome and Firefox).
Close the file system window, then click Next.
Open the ‘Manage Group Permissions’ accordion and give Everyone read access to Objects.
Click Next, then Next again, then review everything and click Upload.

If all has gone well, you should be able to go to the S3 bucket’s URL, see the graphs, and the graphs should be populated with data from the last month if the RDS box which the Lambda function is calling has data.
You can put start and end dates to change the timespan of data that will be rendered.

## Retrieve data from multiple endpoints (optional)
The end result of what we've set up above has only a single endpoint that formats all of the data the same way before returning it, with the client doing not much more than feeding the data into chart.js.
Not everyone may want to follow this pattern, however, or may not want their backend to handle data formatting and manipulation.
This second part will construct the demo in a different way - instead of one API endpoint that returns everything, there will be one endpoint for each data source, and the endpoints will just return the data as-is, leaving the client to handle the formatting.

You will need to create a Lambda function for each service that you want to use. To bundle the .zip files for all four services at once, run

```
gulp bundle:individual
```

This will place four zip files in the dist/ folder, each named ‘bitscoop-data-visualizer-demo-<service>-<version>.zip’.
If you want to create these individually, run

```
gulp bundle:<service>
```

where <service> is one of ‘github’, ‘google’, ‘postman’, or ‘statuscake’, e.g.

```
gulp bundle:google
```

The instructions for creating a Lambda function for each of these is exactly the same as in part 1, apart from uploading the service-specific zip file.
You also do not need to add any environment variables enabling the services, just the five related to the RDS box.

The other major difference is that the API gateway needs to have routes pointing to each endpoint.
Go to the resources for the API gateway you created and click on the '/' resource.
Click on the Actions dropdown and select ‘Create Resource’.
Enter the name of one of the services for the Resource Name, e.g. ‘github’, and by default the Resource Path should be filled in to match.
Leave the checkboxes unchecked, then click Create Resource.
Follow the instructions from part 1 about creating a GET method pointing to the Lambda function you created for that service.

Repeat this step for each service for which you’ve created a Lambda function; make sure to click on and highlight the top-level ‘/’ route before creating each new resource.
When you’ve added resources for all of the services you want to use, highlight the top-level ‘/’ route, then click on the Actions dropdown and select ‘Enable CORS’, then click on the blue button to enable CORS.
Also make sure to re-deploy the API once all of the resources are set up.
