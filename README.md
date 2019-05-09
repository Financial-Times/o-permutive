o-permutive [![Circle CI](https://circleci.com/gh/Financial-Times/o-permutive/tree/master.svg?style=svg)](https://circleci.com/gh/Financial-Times/o-permutive/tree/master)[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](#licence)
=================

Note! this is a Work In Progress Component.

A component for adding the [Permutive Data Management Platform to a website](https://developer.permutive.com/).

- [Markup](#markup)
- [JavaScript](#javascript)
- [Sass](#sass)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Migration](#migration)
- [Contact](#contact)
- [Licence](#licence)

This component will integrate Permutive's Data Management Platform functionality onto a website. Specifically the component will do the following:
- Run the Permutive 'bootstrap' code, this code has been provided by Permutive and is intended to be run before any other Permutive code. This code adds a global variable 'permutive' to the window object and sets-up a 'command-queue' - an array under the window.permutive global object which holds functions which will be called when the Permutive main script is attached and ready. The bootstrap code also sets-up the Permutive-DFP integration (GPT).
- Check user-consent for behavioural profiling - no Permutive code (including the above mentioned bootstrap code) will be run if a user has not consented to behavioural profiling.
- Attach the main Permutive JS file to the page DOM.
- Calls Permutive's api function to link Permutive's unique id assigned to a user with first-party ID's (e.g. User GUIDs, SpoorIDs). This is configurable.
- Calls Permutives api function for passing meta-data associated with a page visit.
- Note; Permutive's code integrates with Google DFP for passing user segments into ad-server requests.

### Markup

The component takes a number of different configuration options, these are detailed below. Required configuration options are marked as required.

- Public ID *required*; config attribute name "id". String. This is the public ID provided by Permutive.
- Public Key *required*; config attribute name "key". String. This is the public API key provided by Permutive.
- User consent. *defaults to false*; config attribute name "consent". Boolean, true/false.
  The component will not run any Permutive code unless user consent has been explicitly given. This is passed in as a config
- UserID(s); config attribute name "userids". JSON Object in the format:
  ``` {
      id: <userID>,
      tag: 'SporeID'
    },
    {
      id: <userID>,
      tag: 'GUID'
    }
  ```
- Page metadata; config attribute name "metadata". JSON Object.

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
