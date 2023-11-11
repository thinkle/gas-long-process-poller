# Google Apps Script Long Process Poller

This library is designed to make it easy to get updates from a clientside script (in a sidebar or dialog) about a long-running google apps script process and to make it possible for the user to interrupt the process.

On the client side, this will look like:

```js
google.script.run
  .withSuccessHandler(showUpdateInYourUI(processUpdate))
  .getFunctionStatus('function name')


function showUpdateInYourUI (processUpdate) {
  // Now you can update your UI with a handy
  // process update object!
}
```

On the Apps Script side, you have two APIs available. The full-service model looks like this:

```js
import {ProcessUpdater} from 'gas-long-process-poller';
let updater = new ProcessUpdater({
  func : 'myFunctionName',
  name : 'My User Facing Description',  
})
```

And then in your long running process, you need to call:

```js
try {
  updater.addAction({
    ACTION
  })
} catch (err) {
  // Handle interruption
}
```

The updater also keeps track of the last action as currentAction if you want to update it, so you could do something like...

```
try {
  updater.addAction({
    name : 'Read list of 1,000 files',
    total : 1000,
    current: 1,
  })
} catch (err) {
  // handle user interrupt
}
```

Then later you can update the count like this:
```
updater.currentAction.curent++;
try {
  updater.doUpdate();
} catch (err) {
  // handle user interrupt error
}
```

## Mocks

We provide a convenient mock library for import in testing libraries if you want to test your front-end code outside of a GoogleAppsScript environment.

```javascript
import {ProcessUpdater} from 'gas-long-process-poller/dist/mocks';
let updater = new ProcessUpdater({
  func : 'myFunctionName',
  name : 'My User Facing Description',  
})

// We can now use the ProcessUpdater API in just the same way we would
// otherwise.
```

To access this same code on your "front end" you'll need your mock google
apps script API to use our other mocks...
```javascript
// Mock API...
export {getFunctionStatus, interruptFunction} from 'mocks';
```

This is quite handy if you're using a package like:
[google-apps-script-run-ts-mocks](https://www.npmjs.com/package/google-apps-script-run-ts-mocks).
