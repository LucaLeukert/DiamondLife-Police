$(document).ready(function () {
	$('#list--search').on('keyup', function () {
		var value = $(this).val().toLowerCase()
		$('#list li').filter(function () {
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		})
	})
})
