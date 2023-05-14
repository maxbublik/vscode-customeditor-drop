'use strict';

import * as vscode from 'vscode';

class DropsEditorProvider implements vscode.CustomTextEditorProvider {

	constructor(private readonly extensionUri: vscode.Uri) { }

    public async resolveCustomTextEditor(document: vscode.TextDocument, panel: vscode.WebviewPanel) {

		function sendDocumentToWebview() {
			panel.webview.postMessage(
				JSON.parse(document.getText().trim() || '[]')
			);
		}
		function updateDocument(items: any) {
			const edit = new vscode.WorkspaceEdit();
			edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), JSON.stringify(items, null, 2));
			return vscode.workspace.applyEdit(edit);
		}

		const disposables: vscode.Disposable[] = [];
		function dispose() {
			while (disposables.length) {
				disposables.pop()?.dispose();
			}
		}

        panel.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'out')],
        };
        panel.webview.html = this.getHtmlForWebview(panel.webview);

		vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString()) {
				sendDocumentToWebview();
			}
		}, this, disposables);

		panel.webview.onDidReceiveMessage((data) => {
			if (data === 'onWebviewReady') {
				sendDocumentToWebview();
			} else {
				updateDocument(data);
			}
		}, this, disposables);

		panel.onDidDispose(dispose, this, disposables);
    }

    private getHtmlForWebview(webview: vscode.Webview): string {
		const nonce = getNonce();
		const scriptSrc = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'out', 'DropsEditor.js'));
		return `<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style>
					.dragoverHighlight { background-color: var(--vscode-inputValidation-warningBackground); }
				</style>
			</head>
			<body style="min-height:100vh">
				<p style="line-height:2">
					This is a webview. Custom editor for <kbd>*.drops.json</kbd> files.
					<br>
					Try to drag-n-drop pills from DROPSVIEW (under Explorer) onto this webview to add entries to the underlying json file.
				</p>
				<p style="line-height:2">
					Every pill from DROPSVIEW has <kbd>event.dataTransfer.setData('text/uri-list', value);</kbd> - and the value appears in json's <kbd>urilist</kbd> field.
					<br>
					But if you try to drag-n-drop a file from Explorer tree view, nothing happens :-(
				</p>
				<pre id="store" style="font-size:small"></pre>
				<script nonce="${nonce}" src="${scriptSrc}"></script>
			</body>
		</html>`;
    }
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

export default DropsEditorProvider;
