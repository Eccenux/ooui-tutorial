import {PromptWindow} from './PromptWindow.js';


$( function () {
	const input = new OO.ui.MultilineTextInputWidget( {
		autosize: true,
		value: `'''Rezultat zgłoszenia''' (tytuł art. dla multi?). ...`,
	} );

	var button = new OO.ui.ButtonWidget( {
		label: 'Okienko',
		icon: 'speechBubbles',
		title: 'Testowe okienko'
	} );
	button.$element.on('click', () => {
		const dialog = new PromptWindow('Komentarz do zgłoszenia', 'Wpisz uzasadnienie / podsumowanie:');
		dialog.open(`'''Usunięto'''. --~~~~`);
	});

	// Append to the wrapper
	$( '.wrapper' ).append(...[
		input.$element,
		button.$element,
	] );
} );