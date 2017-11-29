# 1. Create accounts, add API maps to BitScoop, and set up authorization
First, you need to [create a BitScoop account](https://bitscoop.com/signup) as well as [an AWS account](https://portal.aws.amazon.com/billing/signup).

You will need to add four Maps to your BitScoop account as detailed below.

Also make sure that you have created an [API key for BitScoop](https://bitscoop.com/keys) with full permissions to access data, maps and connections, as all calls to the BitScoop API must be signed with one.
Permissions can be modified by clicking on the 'Details' button for the key once it has been created; by default keys have no permissions enabled.

## Add API Maps to BitScoop

Templates of the Maps you need to add are below.
Just click on the 'Add to BitScoop' button next to each one.
You only need to add the ones to BitScoop that you want to try for yourself.
Make sure to substitute the values for the API keys, client IDs, and client secrets where appropriate.

| API Map   | File Name       |                                                                                                                                                                                                                                    |
|----------------|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Postman Pro API Monitors | postman.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-data-science-demo/master/fixtures/maps/postman.json) |
| Google Analytics Data | google_analytics.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-data-science-demo/master/fixtures/maps/google_analytics.json) |
| StatusCake Health Alerts | statuscake.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-data-science-demo/master/fixtures/maps/statuscake.json) |
| GitHub Issues | github.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-data-science-demo/master/fixtures/maps/github.json) |

Upon clicking each button, you will be redirected to BitScoop and will see the JSON for the map you just added.
Click the ‘+ Create’ button in the upper right-hand corner to save the map.
Make sure to add all four maps.
You will get auth_key and auth_secret for each Map in a bit, while the redirect_url will be updated later; for now, leave them as is.
When each Map is added, you should be redirected to the details page for the Map, and under Authentication you should see ‘Callback URL’, which you’ll need to use in that service's respective next steps.
Also take note of each Map’s ID, which will be used later as an Environment Variable when setting up the Lambda function that will serve the backend views.

### Postman
You will need to create a Postman account at https://www.getpostman.com/.

In Postman, create a Monitor for an API you wish to test, then click on the Monitor.
The Monitor’s ID should be the last thing in the URL path, e.g. https://<appname>.postman.co/monitors/<monitor_id>.

Go to 'Integrations' on the main menu, select 'Postman Pro API', and then create a new key.

The Monitor ID and API Key will be saved later as Environment Variables in Lambda.

- Postman Pro API Documentation:  https://docs.api.getpostman.com/

- Postman Monitor: https://www.getpostman.com/docs/monitors

- Postman Documentation: https://www.getpostman.com/docs/

### Google Analytics
When signed into a Google account, go to the [Google API Console for Analytics](https://console.developers.google.com/apis/api/analytics.googleapis.com/overview) and make sure Analytics is enabled.

Next go to [Google Analytics Settings](https://analytics.google.com/analytics/web/#management/Settings/), then select the View you want to use in the right-hand column and then ‘View Settings’ underneath that.
Under Basic Settings you should see the View ID; it should look like ga:123456789.

The View ID will be saved later as an Environment Variable in Lambda.

You must also create a Connection to the Google Map that will be used to sign your requests.
Make a POST request to the Connection URL shown on the Details page for the Google Analytics map; it will be in the form https://api.bitscoop.com/<map_id>/connections.
The response body will contain two fields, 'redirectUrl' and 'id'.
Save 'id', which is the ID of the new connection, for later, and go to the redirectUrl in a browser.
Google should request authorization for the Analytics API for one of your Google accounts.
If successful, you should be able to make calls via that map with the header 'X-Connection-Id: <connection_id>'.

- Google Analytics API Documentation: https://developers.google.com/analytics/

- Google API Console for Analytics: https://console.developers.google.com/apis/api/analytics.googleapis.com/overview

### StatusCake
You will need to create a StatusCake account at https://www.statuscake.com/.

Go to 'User Details' on the main menu and take note of your Username, and then select 'API Keys' to find your API key.
Click on 'New Test' on the left-hand side and configure it as desired, then click 'Save Now' in the lower left-hand corner.
View the Details for that test; the Test ID can be found in the URL under the ‘tid’ parameter.

Example: Test ID 7654321 is derived from

https://app.statuscake.com/AllStatus.php?tid=7654321

You will need to enter the API Key and Username in the StatusCake Map.
The Test ID will be saved later as an Environment Variable in Lambda.

- StatusCake API Documentation: https://www.statuscake.com/api/

# GitHub
The GitHub endpoint used for this example is publicly accessible and does not require an API key or GitHub account.
This call will only succeed if the repo in question is public.

Example: https://github.com/nodejs/node

Repo Name is 'node' and Repo Owner Name is 'nodejs'.

The Repo and Owner names will be saved later as Environment Variables in Lambda.

 - GitHub API Documentation https://developer.github.com/
