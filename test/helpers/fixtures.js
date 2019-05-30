let sandboxEl;

function createSandbox() {
	if (document.querySelector('.sandbox')) {
		sandboxEl = document.querySelector('.sandbox');
	} else {
		sandboxEl = document.createElement('div');
		sandboxEl.setAttribute('class', 'sandbox');
		document.body.appendChild(sandboxEl);
	}
}

function reset() {
	sandboxEl.innerHTML = '';
}

function insert(html) {
	createSandbox();
	sandboxEl.innerHTML = html;
}


function htmlCode (type) {
	let config = ` data-o-permutive-projectId="id-123" data-o-permutive-publicApiKey="api-key-456"`;
	if(type == 'basic') {
		config = '';
	}
	const html = `
		<!doctype html>
		<html>
			<head>
				<meta
					id="element"
					class="o-permutive"
					data-o-component="o-permutive"
					${config}
				>
				</meta>
			</head>
		</html>
	`;
	insert(html);
}

export {
	htmlCode,
	reset
};
