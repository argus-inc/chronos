# Chronos

Chronos is a simple tool that let's you control and handle simple javascript cronjobs for your project.

[![Version](https://img.shields.io/badge/git-%40argus--inc%2Fchronos-orange)](https://github.com/argus-inc/chronos/packages/352662)
[![Downloads/week](https://img.shields.io/github/package-json/v/argus-inc/chronos)](https://github.com/argus-inc/chronos/packages/352662)
[![License](https://img.shields.io/github/license/argus-inc/chronos)](https://github.com/argus-inc/chronos/blob/master/LICENSE)

## Installation

**Yarn:**

```
yarn add https://github.com/argus-inc/chronos
```

**NPM:**

```
npm install @argus-inc/chronos
```

---

## Configuration

Create a file with your cron configuration.
For each cron you will have to specify: `path, recurrence, command, name`

**path:** Specify an absolute path to the file you want to run as cron.

**recurrence:** The crontab recurrence string

**command:** The command the cron will be executed with eg: `node`

**name:** Name of the cron

```
[
    {
        "path": "/Users/xxx/programs/myProgram/cron/index.js",
        "recurrence": "*/5 * * * *",
        "command": "node",
        "name": "getEvents"
    },
    {
        "path": "/Users/xxx/programs/myProgram/cron/apiCall.js",
        "recurrence": "*/5 * * * *",
        "command": "node",
        "name": "getUsers"
    }
]
```

## Add to `package.json`

You can then add this command as a script to your `package.json`.

```
"scripts": {
    "cron": "yarn run chronos --config=src/config/chronos.json",
},
```

---

## Author

**Author**: [Argus](https://github.com/argus-inc)

**Developer**: [Mederic Burlet](https://github.com/crimson-med)

**Licence**: [GPL-3-0-only](https://github.com/argus-inc/chronos/blob/master/LICENSE)


