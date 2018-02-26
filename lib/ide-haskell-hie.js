const childProcess = require('child_process')
const os = require('os')
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
    var hiePath = atom.config.get("ide-haskell-hie.hiePath"),
        useHieWrapper = atom.config.get("ide-haskell-hie.useHieWrapper"),
        useCustomHieWrapper = atom.config.get("ide-haskell-hie.useCustomHieWrapper"),
        useCustomHieWrapperPath = atom.config.get("ide-haskell-hie.useCustomHieWrapperPath"),
        hieDebug = atom.config.get("ide-haskell-hie.isDebug"),
        hieLoggingPath = atom.config.get("ide-haskell-hie.hieLoggingPath");

    // Set up the path for the hie-wrapper script.
    var pluginPath = atom.packages.resolvePackagePath('ide-haskell-hie');
    var processOptions = {};
    if (pluginPath && useHieWrapper) {
      hiePath = path.join(pluginPath, 'hie-wrapper.sh');
      // Get the project path, so we can set it as the CWD of the hie process.
      var projectPaths = atom.project.getPaths();
      if (projectPaths.length > 0) {
        processOptions = {'cwd': projectPaths[0]};
      }
    }
    if (useCustomHieWrapper && useCustomHieWrapperPath) {
      hiePath = useCustomHieWrapperPath;
      var projectPaths = atom.project.getPaths();
      if (projectPaths.length > 0) {
        processOptions = {'cwd': projectPaths[0]};
        // Expand project placeholders.
        hiePath = hiePath
          .replace('${workspaceFolder}', projectPaths[0])
          .replace('${workspaceRoot}', projectPaths[0]);
      }
      // Expand home directory placeholders.
      hiePath = hiePath
        .replace('${HOME}', os.homedir)
        .replace('${home}', os.homedir)
        .replace('~', os.homedir);
      // Don't assume any arguments when using a custom wrapper.
      var args = [''];
    } else {
      var args = ['--lsp'];
      if (hieDebug === true) {
        args.push('--debug', '-l', hieLoggingPath);
      }
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
    return lspServer
  }

  enableDebug(enabled) {
    atom
      .config
      .set('core.debugLSP', enabled)
  }
}

module.exports = new HaskellLanguageClient()
