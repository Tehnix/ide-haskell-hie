const childProcess = require('child_process')
const {shell} = require('electron')
const {AutoLanguageClient} = require('atom-languageclient')
const path = require('path');

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
    let hiePath = atom.config.get("ide-haskell-hie.hiePath"),
        useHieWrapper = atom.config.get("ide-haskell-hie.useHieWrapper"),
        hieDebug = atom.config.get("ide-haskell-hie.isDebug"),
        hieLoggingPath = atom.config.get("ide-haskell-hie.hieLoggingPath");

    // Set up the path for the hie-wrapper script.
    let pluginPath = atom.packages.resolvePackagePath('ide-haskell-hie'),
        processOptions = {};
    if (pluginPath && useHieWrapper) {
      hiePath = path.join(pluginPath, 'hie-wrapper.sh');
      // Get the project path, so we can set it as the CWD of the hie process.
      let projectPaths = atom.project.getPaths();
      if (projectPaths.length > 0) {
        processOptions = {'cwd': projectPaths[0]};
      }
    }

    // // Add a command to restart the HIE server.
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace',
      {'hie:restart-server': () => this.restartServer()})
    );

    let args = ['--lsp'];
    if (hieDebug === true) {
      args.push('--debug', '-l', hieLoggingPath);
    }

    const lspServer = childProcess.spawn(hiePath, args, processOptions)
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
    return lspServer;
  }

  enableDebug(enabled) {
    atom
      .config
      .set('core.debugLSP', enabled);
  }

  restartServer() {
    this.subscriptions.dispose();
    this.restartAllServers();
    atom.notifications("HIE has been restarted!");
  }
}

module.exports = new HaskellLanguageClient()
