const form = document.getElementById('registerForm')

form.addEventListener('submit', (e) => {
	e.preventDefault()
	const data = new FormData(form)
	const obj = {}
	data.forEach((value, key) => (obj[key] = value))
	//hacer el fetch
	fetch('/api/sessions/register', {
		method: 'POST',
		body: JSON.stringify(obj),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((response) => {
		if (response.status === 201) {
			window.location.replace('/')
		} else {
			console.log('algo salio mal')
		}
	})
})
