/* eslint-disable no-undef */
((vscode) => {

	const store = {
		items: [],
		set(items) {
			this.items.splice(0, this.items.length, ...items);
			this.render();
		},
		push(item) {
			this.items.push(item);
			this.render();
		},
		render() {
			document.getElementById('store').textContent = JSON.stringify(this.items, null, 2);
		}
	};

	window.addEventListener('message', (event) => {
		if (Array.isArray(event.data)) {
			store.set(event.data);
		}
	});


	const dropTarget = document.getElementById('dropTarget') || document.body;

	dropTarget.addEventListener('dragenter', (event) => {
		event.preventDefault();
		event.target.classList.add('dragoverHighlight');
	});
	dropTarget.addEventListener('dragleave', (event) => {
		event.target.classList.remove('dragoverHighlight');
	});

	dropTarget.addEventListener('dragover', (event) => {
		// accept any DnD
		event.preventDefault();
	});

	dropTarget.addEventListener('drop', (event) => {
		event.target.classList.remove('dragoverHighlight');
		store.push({
			types: Array.from(event.dataTransfer.types),
			"dataTransfer.getData(text/uri-list)": event.dataTransfer.getData('text/uri-list'),
			"dataTransfer.getData(text/plain)": event.dataTransfer.getData('text/plain'),
			"dataTransfer.files.0.name": event.dataTransfer.files.item(0)?.name,
			when: (new Date).toISOString(),
		});
		vscode.postMessage(store.items);
	});

	vscode.postMessage('onWebviewReady');
})(acquireVsCodeApi());
