'use strict';

import * as vscode from 'vscode';

import DropsEditorProvider from './DropsEditorProvider';
import DropsViewProvider from './DropsViewProvider';

export function activate(context: vscode.ExtensionContext) {

	const dropsEditorProvider = new DropsEditorProvider(context.extensionUri);
	context.subscriptions.push(
        vscode.window.registerCustomEditorProvider('DropsEditorProvider', dropsEditorProvider)
    );

	const dropsViewProvider = new DropsViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('DropsView', dropsViewProvider)
	);
}
