# History

## v2.3.0 2020 September 8

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v2.2.0 2020 August 13

-   For simplicity's sake:
    -   port and hostname are now determined via the function opts, otherwise the plugin config, otherwise the docpad config, otherwise the environment config
        -   this re-enables common port configurations, such as used by `docpad-plugintester`
    -   server is now bounded on `docpadReady` instead of `runAfter`
        -   this makes writing custom testers that depend on the server plugin easier
    -   `url`, `port`, `host`, and `address` are written to the plugin instance
        -   this makes testing serves URLs easier as one can do `docpad.getPlugin('serve').port`
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v2.1.0 2020 August 6

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required node version changed from `node: >=8` to `node: >=10` to keep up with mandatory ecosystem changes

## v2.0.2 2019 August 10

-   Fixed compatibility with Node.js prior 10.x (#2)

## v2.0.1 2018 August 21

-   Initial working release
