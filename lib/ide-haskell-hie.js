const childProcess = require('child_process');
const os = require('os');
const path = require('path');
const { shell } = require('electron');
const { AutoLanguageClient } = require('atom-languageclient');
const { CompositeDisposable } = require('atom');

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

  /*
   * `startServerProcess` will be called automatically for us by the
   * LSP client, and is where the server will be launched from.
   */
  startServerProcess(projectPath) {
    return this.spawnServer(projectPath)
  }

  /*
   * Restart the LSP (hie) server, notify the user, and clear the subscriptions.
   */
  restartServer() {
    this.subscriptions.dispose();
    this.restartAllServers().then(() => {
      atom.notifications.addInfo("HIE is has been restarted, and is currently initializing!");
    }).catch(() => {
      atom.notifications.addError("Something went wrong trying to restart HIE!");
    });
  }

  /*
   * The core logic for starting the LSP server.
   */
  spawnServer(projectPath) {
    let hiePath = atom.config.get("ide-haskell-hie.hiePath"),
      processOptions = {},
      args = [''];
    const useHieWrapper = atom.config.get("ide-haskell-hie.useHieWrapper"),
      useCustomHieWrapper = atom.config.get("ide-haskell-hie.useCustomHieWrapper"),
      useCustomHieWrapperPath = atom.config.get("ide-haskell-hie.useCustomHieWrapperPath"),
      hieDebug = atom.config.get("ide-haskell-hie.isDebug"),
      hieLoggingPath = atom.config.get("ide-haskell-hie.hieLoggingPath"),
      pluginPath = atom.packages.resolvePackagePath('ide-haskell-hie');

    // If `useHieWrapper` is set to true, set up the path for the hie-wrapper script.
    if (pluginPath && useHieWrapper) {
      hiePath = path.join(pluginPath, 'hie-wrapper.sh');
      // We need to set the current working directory, else it will default to the
      // location of the script.
      processOptions = { 'cwd': projectPath };
    }

    // If both `useCustomHieWrapper` is true and `useCustomHieWrapperPath` contains
    // a value (the path), then go ahead and set up hie to launch from the custom
    // wrapper, which also means substituting path placeholders.
    if (useCustomHieWrapper && useCustomHieWrapperPath) {
      hiePath = useCustomHieWrapperPath;
      processOptions = { 'cwd': projectPath };
      // Expand project path and $HOME placeholders.
      hiePath = hiePath
        .replace('${workspaceFolder}', projectPath)
        .replace('${workspaceRoot}', projectPath)
        .replace('${projectPath}', projectPath)
        .replace('${HOME}', os.homedir)
        .replace('${home}', os.homedir)
        .replace(/^~/, os.homedir);
    } else {
      // Else, if we are launching it directly, add the required arguments.
      args = ['--lsp'];
      if (hieDebug) {
        args.push('--debug', '-l', hieLoggingPath);
      }
    }

    // Add a command to restart the HIE server.
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace',
      { 'hie:restart-server': () => this.restartServer() })
    );

    // Start the hie process, and assume HIE is not installed, if the launch
    // fails.
    const lspServer = childProcess.spawn(hiePath, args, processOptions);
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
    }));
    return lspServer;
  }

  /*
   * Enable the LSP debugging found in Settings -> Core -> Debug LSP.
   */
  enableDebug(enabled) {
    atom
      .config
      .set('core.debugLSP', enabled);
  }
}

module.exports = new HaskellLanguageClient()
