const childProcess = require('child_process')
const {shell} = require('electron')
const {AutoLanguageClient} = require('atom-languageclient')

class HaskellLanguageClient extends AutoLanguageClient {
  getGrammarScopes() {
    return ['source.haskell', 'text.tex.latex.haskell', 'source.cabal']
  }
  getLanguageName() {
    return 'Haskell'
  }
  getServerName() {
    return 'hie'
  }

  startServerProcess() {
    if (process.platform === 'win32') {
      // stdio is blocking on Windows so use sockets instead.
      atom
        .notifications
        .addError('HIE is not yet implemented using sockets/TCP.', {
          dismissable: true,
          description: 'This will occur if you are using HIE on Windows, since stdio is blocking.'
        })
      return null
    } else {
      return this.spawnServer()
    }
  }

  spawnServer() {
    this.enableDebug(true)

    const lspServer = childProcess.spawn('hie', ['--lsp'])
    lspServer.on('error', err => atom.notifications.addError('Unable to start the HIE (Haskell IDE Engine).', {
      dismissable: true,
      buttons: [
        {
          text: 'Setup HIE',
          onDidClick: () => shell.openExternal('https://github.com/haskell/haskell-ide-engine/blob/master/README.md#installation')
        }, {
          text: 'Open Dev Tools',
          onDidClick: () => atom.openDevTools()
        }
      ],
      description: 'This can occur if you do not hie on your path, or you have yet to install it.'
    }))
    return lspServer
  }

  enableDebug(enabled) {
    atom
      .config
      .set('core.debugLSP', enabled)
  }
}

module.exports = new HaskellLanguageClient()
