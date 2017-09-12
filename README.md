# [Alpha!] Atom plugin for HIE LSP server

Rudimentary support for [HIE](https://github.com/haskell/haskell-ide-engine), relies on [atom-ide-ui](https://atom.io/packages/atom-ide-ui) for displaying LSP interactions. Internatlly uses [atom-languageclient](https://github.com/atom/atom-languageclient) for the LSP client, and [HIE](https://github.com/haskell/haskell-ide-engine) as the LSP server.

Currently requires Atom `>=1.21.0`, which, at the time of writing, is the [Atom beta](https://atom.io/beta), because of the new incoming updates that the LSP client relies on. You can check out the official announcement for LSP support [on the Atom blog](https://blog.atom.io/2017/09/12/announcing-atom-ide.html) and check out the [using-atom-ide](https://blog.atom.io/2017/09/12/announcing-atom-ide.html#using-atom-ide) section for more details on how it works.

## A few screenshots of the working things


#### Type/Datatips information on hover & Definitions/Hyperclick

![Definitions/Hypercick support](https://user-images.githubusercontent.com/1189998/30351887-6a3f4d70-9858-11e7-87ae-ab90be448023.png)

#### Linter/diagnostics on save

![Linter Errors](https://user-images.githubusercontent.com/1189998/30351907-7d3d585e-9858-11e7-9a2f-66a8a1582010.png)

#### Outline view & Highlighting

![Outline view on the right side and highlight of anotherFunc](https://user-images.githubusercontent.com/1189998/30351896-71e56dca-9858-11e7-85d7-1d90eee11807.png)


## Not working/Broken

- Code actions (should be minor work)
- Find references (not implemented)
- Busy signal (I guess?)
- Code format (will put the cursor at the end of the file on every save)

# Miscellaneous

The code for the providers that HIE supports can be found [here](https://github.com/haskell/haskell-ide-engine/blob/master/src/Haskell/Ide/Engine/Transport/LspStdio.hs#L758) (permanent link [here](https://github.com/haskell/haskell-ide-engine/blob/0e520cf8f93dbc6a41723bfc95c8c43f87fa6757/src/Haskell/Ide/Engine/Transport/LspStdio.hs#L758)).
