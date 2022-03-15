$(document).ready(function () {
	$('#list--search').on('keyup', function () {
		var value = $(this).val().toLowerCase()

		if (value === 'yung hurn') {
			window.location = 'https://www.youtube.com/watch?v=sVjf-NlHpHQ'
		} else if (value === 'juri') {
			window.location = '/images/juri.png'
		}

		$('#list li').filter(function () {
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		})
	})
})
