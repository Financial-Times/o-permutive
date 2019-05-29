o-permutive [![Circle CI](https://circleci.com/gh/Financial-Times/o-permutive/tree/master.svg?style=svg)](https://circleci.com/gh/Financial-Times/o-permutive/tree/master)[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](#licence)
=================

Note! this is a Work In Progress Component.

A component for adding the [Permutive Data Management Platform to a website](https://developer.permutive.com/).

- [Functionality Overview](#Functionality)
- [Deployment](#Deployment)
- [Markup](#markup)
- [JavaScript](#javascript)
- [Sass](#sass)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Migration](#migration)
- [Contact](#contact)
- [Licence](#licence)

### Functionality Overview
This component will integrate Permutive's Data Management Platform functionality onto a website. Specifically the component will do the following:
- Runs the Permutive 'bootstrap' code, this code has been provided by Permutive and is intended to be run before any other Permutive code. A global variable, 'permutive' is added to the window object and  a 'command-queue' array is defined under the window.permutive global object which holds functions which will be called when the Permutive main script is attached and ready. The bootstrap code also sets-up the Permutive-DFP integration (GPT).
- Checks for user-consent for behavioural profiling - no Permutive code (including the above mentioned bootstrap code) will be run if a user has not consented to behavioural profiling.
- Attaches the main Permutive JS file to the page DOM.
- Calls Permutive's api function to link Permutive's unique id assigned to a user/device with first-party ID's (e.g. User GUIDs, SpoorIDs). This is configurable.
- Calls Permutives api function for passing meta-data associated with a page visit.
- Note; Permutive's code integrates with Google DFP for passing user segments into ad-server requests.

### Deployment
The o-permutive component can be deployed in the same way as all standard Origami components; either via the Build-service or as a Bower dependancy, (an NPM compatible version of the component is being worked on for a furture release). See the [Origami tutorials](https://origami.ft.com/docs/tutorials/) for more details on how Origami components can be deployed or integrated into a build-pipeline.

### Configuration
The component takes a number of different configuration options, these are detailed below.

##### Basic config options
These are the minimum set of config options required to run the Permutive component.

| Name              | Key               |   Type   | Required?| Notes |
|-------------------|-------------------|----------|---------:|-------|
| Public project ID | projectId  | String   | yes      |This is the project ID provided by Permutive. |
| Public api key    | publicApiKey | String   | yes      |This is the public API key provided by Permutive.|
| User consent      | consent.behavioural        | Boolean true/false default is false  | no       |  The component will not run any Permutive code unless user consent has been explicitly given. This can be passed in as a config or for FT sites can be derived via the ftconsent cookie, see below.|
| Use FT consent cookie| consent.useFtCookie | Bolean true/false | no |If true, user consent will be derived via the ftconsent cookie |

##### User identification config options  
Supply these config options if you wish to make use of Permutive's User Identity Matching features whereby Permutive's unique user ID can be mapped to first-party User IDs. This would be needed for cross-device User matching for example.

| Name              | |Data-structure              | Required?| Notes |
|-------------------|---|-----------------------------|---------:|-------|
| User IDs Array    | userIDs  | Array of objects. See example below | yes, see notes | Required if cross device user matching is required and not using the FT ads-api |
| User Api Endpoint | userApi  |String | no | Required if cross device user matching is required and User Identity information is available via the FT ads-api or other api that returns data in a specified format. |

###### Example config object for User Ids

```javascript
userIds = [
	{
		id: <userID>,
		tag: 'SporeID'
	},
	{
		id: <userID>,
		tag: 'GUID'
	}
]
```

##### Page metadata options
The following data-points may be passed to Permutive on each page request. All data-points are optional; however the schema is fixed, meaning that any data passed that is not in the format specified below will be rejected.
Any data-point below may be omitted if it is not available or not relevant for the page request.

```javascript
page = {
	"type": "<STRING>", // e.g. "home" or "article"
	"article": {
		"id": "<STRING>",
		"title": "<STRING>",
		"type": "<STRING>", // genre
		"organisations": ["<LIST>", "<OF>", "<STRINGS>"],
		"people": ["<LIST>", "<OF>", "<STRINGS>"],
		"categories": ["<LIST>", "<OF>", "<STRINGS>"],
		"authors": ["<LIST>", "<OF>", "<STRINGS>"],
		"topics": ["LIST", "OF", "STRINGS"],
		"admants": ["LIST", "OF", "STRINGS"]
	},
	"user": {
		"industry": "<STRING>",
		"position": "<STRING>",
		"responsibility": "<STRING>"
	}
}
```

### Markup


```html
<div data-o-component="o-permutive" class='o-permutive'>
</div>
```

### JavaScript


No code will run automatically unless you are using the Build Service.
You must either construct an `o-permutive` object or fire the `o.DOMContentLoaded` event, which oComponent listens for.

#### Constructing an o-permutive

```js
const oPermutive = require('o-permutive');
oPermutive.init();
```

#### Firing an oDomContentLoaded event

```js
require('o-permutive');

document.addEventListener('DOMContentLoaded', function() {
	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
});
```
TODO - documentation.

## Troubleshooting

TODO

## Migration

_We use tables to represent our migration guides. Be sure to update it when there is a major release, and update MIGRATION.md, as well_

State | Major Version | Last Minor Release | Migration guide |
:---: | :---: | :---: | :---:
✨ active | 3 | N/A | [migrate to v3](MIGRATION.md#migrating-from-v2-to-v3) |
⚠ maintained | 2 | 2.0 | [migrate to v2](MIGRATION.md#migrating-from-v1-to-v2) |
╳ deprecated | 1 | 1.0 | N/A |

## Contact

If you have any questions or comments about this component, or need help using it, please either [raise an issue](https://github.com/Financial-Times/o-permutive/issues), visit [#advertising-dev](https://financialtimes.slack.com/messages/advertising-dev/) or email [FT Advertising-dev Support](mailto:origami.advertising.technology@ft.com).

## Licence

This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).
