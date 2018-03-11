# Atom plugin for HIE LSP server
Rudimentary support for [HIE](https://github.com/haskell/haskell-ide-engine), relies on [atom-ide-ui](https://atom.io/packages/atom-ide-ui) for displaying LSP interactions, and [language-haskell](https://atom.io/packages/language-haskell) to identify Haskell files. Internatlly uses [atom-languageclient](https://github.com/atom/atom-languageclient) for the LSP client, and [HIE](https://github.com/haskell/haskell-ide-engine) as the LSP server.

To get hie to automatically detect the correct hie version to use based on your projects GHC version, enable the experimental flag 'Use hie-wrapper', and make sure to build your project using the Makefile in the [HIE](https://github.com/haskell/haskell-ide-engine) repository (builds multiple versions of hie).

## Installation

You can install `ide-haskell-hie` by using [`apm`](https://github.com/atom/apm).
```
apm install ide-haskell-hie
```
Or via _Atom > Settings view > Install Packages > Search packages > ide-haskell-hie_

### From source
To contribute to `ide-haskell-hie` you might want to install it from source:
```
# Get source from `ide-haskell-hie` repository
git clone git@github.com:Tehnix/ide-haskell-hie.git
cd ide-haskell-hie
# install dependencies
npm install
# link local version in `dev` mode
apm link --dev
# start Atom in `dev` mode
atom --dev
# To unlink local version of `ide-haskell-hie` run
apm unlink --dev
```
For more information about `apm` and `link` check [Contributing to Official Atom Packages]( https://flight-manual.atom.io/hacking-atom/sections/contributing-to-official-atom-packages/#contributing-to-official-atom-packages).


## Configuration

The plugin should work out-the-box, but your environment may differ for many reasons, and the following are some configurations that might help you get it working.

- `Absolute path to hie executable` will set the path to hie, in case it's not on your $PATH.
- `Use hie wrapper` makes Atom use the `hie-wrapper.sh` file to start hie through. This does assume that you built the hie executable using `make build`, but will fall back to plain `hie`.
- `Use custom hie wrapper` enables you to use your own custom hie wrapper script, if the standard one doesn't suit your need (e.g. to use with nix).
- `The path to your custom hie wrapper` specifies the path to the custom wrapper, and is required for it to take effect.
- `Turn on debugging output` passes the `--debug` flag to hie (although not if using a custom wrapper, then you're on your own).
- `Log to a file (if debugging is on)` will set the log file that debug writes to.

For additional debugging (e.g. stderr), you can enable `Settings -> Core -> Debug L S P`, and then view the output in the Atom Developer Console.


## A few screenshots of the working things
#### Type/Datatips information on hover & Definitions/Hyperclick
![Definitions/Hypercick support](https://user-images.githubusercontent.com/1189998/30351887-6a3f4d70-9858-11e7-87ae-ab90be448023.png)

#### Linter/diagnostics on save
![Linter Errors](https://user-images.githubusercontent.com/1189998/30351907-7d3d585e-9858-11e7-9a2f-66a8a1582010.png)

#### Outline view & Highlighting
![Outline view on the right side and highlight of anotherFunc](https://user-images.githubusercontent.com/1189998/30351896-71e56dca-9858-11e7-85d7-1d90eee11807.png)

#### Code actions
![Code actions being applied](https://user-images.githubusercontent.com/1189998/32152232-092b5aaa-bd66-11e7-8b48-583f21a9231e.gif)

#### Code format
No screenshot really necessary here.

## Not implemented

- Find references (HIE does not support this yet, see [issue #361](https://github.com/haskell/haskell-ide-engine/issues/361))
- Rename (HIE supports it, but [atom-languageclient](https://github.com/atom/atom-languageclient#capabilities) is TBD, see [issue #13](https://github.com/atom/atom-languageclient/issues/13))

# Miscellaneous
The code for the providers that HIE supports can be found [here](https://github.com/haskell/haskell-ide-engine/blob/master/src/Haskell/Ide/Engine/Transport/LspStdio.hs#L758) (permanent link [here](https://github.com/haskell/haskell-ide-engine/blob/0e520cf8f93dbc6a41723bfc95c8c43f87fa6757/src/Haskell/Ide/Engine/Transport/LspStdio.hs#L758)).
