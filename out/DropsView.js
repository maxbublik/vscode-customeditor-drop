/* eslint-disable no-undef */
(() => {

	for (let dragExample of document.querySelectorAll('.dragExample')) {
		dragExample.addEventListener('dragstart', (event) => {
			let uri = 'https://google.com?search=' + event.target.textContent;
			event.dataTransfer.setData('text/uri-list', uri);
		});
	}

})();
