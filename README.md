# [Alpha!] Atom plugin for HIE LSP server

Rudimentary support for [HIE](https://github.com/haskell/haskell-ide-engine), relies on [atom-ide-ui](https://atom.io/packages/atom-ide-ui) for displaying LSP interactions. Internatlly uses [atom-languageclient](https://github.com/atom/atom-languageclient) for the LSP client, and [HIE](https://github.com/haskell/haskell-ide-engine) as the LSP server.

Currently requires Atom `>=1.21.0`, which, at the time of writing, is the [Atom beta](https://atom.io/beta), because of the new incoming updates that the LSP client relies on. You can check out the official announcement for LSP support [on the Atom blog](https://blog.atom.io/2017/09/12/announcing-atom-ide.html) and check out the [using-atom-ide](https://blog.atom.io/2017/09/12/announcing-atom-ide.html#using-atom-ide) section for more details on how it works.

## A few screenshots (only showing a subset!)

#### Type information on hover

![Type information](https://user-images.githubusercontent.com/1189998/30077656-7bb51cc0-92b7-11e7-9273-575c0e41e2e1.png)

#### Linter warnings on save

![linter warnings](https://user-images.githubusercontent.com/1189998/30077655-7a15e58e-92b7-11e7-8770-63eba732e72d.png)

# Miscellaneous

The code for the providers that HIE supports can be found [here](https://github.com/haskell/haskell-ide-engine/blob/master/src/Haskell/Ide/Engine/Transport/LspStdio.hs#L758) (permanent link [here](https://github.com/haskell/haskell-ide-engine/blob/0e520cf8f93dbc6a41723bfc95c8c43f87fa6757/src/Haskell/Ide/Engine/Transport/LspStdio.hs#L758)).
