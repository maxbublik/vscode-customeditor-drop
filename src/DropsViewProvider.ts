'use strict';

import * as vscode from 'vscode';

class DropsViewProvider implements vscode.WebviewViewProvider {

	constructor(private readonly extensionUri: vscode.Uri) { }

	resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext) {

		webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'out')],
        };
        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

    }

    private getHtmlForWebview(webview: vscode.Webview): string {
		const nonce = getNonce();
		const scriptSrc = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'out', 'DropsView.js'));
		return `<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style>
					.dragExample { border-radius: 9001px; border: 1px solid var(--vscode-button-background); color: var(--vscode-button-background); padding: 0.2em 0.5em; }
				</style>
			</head>
			<body>
				<br>
				<span class="dragExample" draggable="true">dragFromView1</span>
				<br><br>
				<span class="dragExample" draggable="true">dragFromView2</span>
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

export default DropsViewProvider;
