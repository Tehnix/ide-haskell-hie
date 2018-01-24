const childProcess = require('child_process')
const {shell} = require('electron')
const {AutoLanguageClient} = require('atom-languageclient')

class HaskellLanguageClient extends AutoLanguageClient {
  getGrammarScopes() {
    return ['source.haskell', 'text.tex.latex.haskell']
  }
  getLanguageName() {
    return 'Haskell'
  }
  getServerName() {
    return 'hie'
  }

  startServerProcess() {
    return this.spawnServer()
  }

  spawnServer() {
    var hiePath = atom.config.get("ide-haskell-hie.hiePath"),
        hieDebug = atom.config.get("ide-haskell-hie.isDebug"),
        hieLoggingPath = atom.config.get("ide-haskell-hie.hieLoggingPath");

    // this.enableDebug(false)
    var args = ['--lsp'];
    if (hieDebug === true) {
      args.push('--debug', '-l', hieLoggingPath);
    }

    const lspServer = childProcess.spawn(hiePath, args)
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
