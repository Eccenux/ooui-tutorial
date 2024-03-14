/* global OO */

const i18n = {
	prompt__save: 'Zapisz',
	prompt__cancel: 'Anuluj',
	prompt__close_confirm: 'Czy na pewno chcesz anulować? Oprócz komentarza gadżet zmienia status lnDNU. Jeśli anulujesz, to dodaj ręcznie parametry lnDNU.',
};

/**
 * Comment prompt for closing removal requests.
 */
export class PromptWindow {
	/**
	 * @param {String} title Title.
	 * @param {String} info Initial info.
	 */
	constructor(title, info='') {
		this.title = title;
		this.info = info;
		/** @private Name for OO's .addWindows(). */
		this.codeName = 'dnuPromptWindow';
		/**
		 * @type {OO.ui.Dialog}
		 * @private
		 */
		this.dialogInternal = false;
		/**
		 * @type {Element}
		 * @private
		 */
		this.elInfo = false;
		/**
		 * @type {OO.ui.MultilineTextInputWidget}
		 * @private
		 */
		this.ooInput = false;
	}
	
	/**
	 * Show dialog.
	 * @param {String} value Startup value.
	 */
	open(value = '') {
		if (!this.dialogInternal) {
			this.init(value);
		}
		this.windowManager.openWindow( this.dialogInternal );
	}

	/** Force resize (e.g. after update). */
	forceResize() {
		// this.dialogInternal.close();
		// this.dialogInternal.open();
		this.windowManager.updateWindowSize(this.dialogInternal);
	}

	/** @private Action: cancel (async, non-blocking).*/
	actionCancel(dialog, action) {
		// OO.ui.confirm(i18n.prompt__close_confirm).then(( confirmed ) => {
		// 	console.log('[PromptWindow]', {confirmed});
		// 	if (confirmed) {
		// 		dialog.close( { action: action } );
		// 	}
		// });
		if (confirm(i18n.prompt__close_confirm)) {
			dialog.close( { action: action } );
		}
	}

	/** @private Action: save (async, blocking).*/
	actionSave(dialog, action) {
		return new Promise((resolve, reject) => {
			setTimeout(()=>{
				if ( action == 'save') {
					resolve();
					dialog.close( { action: action } );
				} else {
					reject();
				}
			}, 2000);
		})
	}

	/** @private init OO boilerplate.*/
	init(value) {
		const me = this;

		function DialogInternal( config ) {
			DialogInternal.super.call( this, config );
			// this.modal = false;
			// this.forceTrapFocus = true;
		}
		OO.inheritClass( DialogInternal, OO.ui.ProcessDialog ); 
	
		// Close the dialog when the Escape key is pressed.
		DialogInternal.static.escapable = false;
		// Name for .addWindows()
		DialogInternal.static.name = this.codeName;
		// Startup title.
		DialogInternal.static.title = this.title;
		// Button(s).
		DialogInternal.static.actions = [
			{ action: 'save', label: i18n.prompt__save, flags: [ 'primary', 'progressive' ] },
			{ action: 'cancel', label: i18n.prompt__cancel, flags: [ 'secondary', 'destructive' ] },
		];
	
		// Add content to the dialog body.
		DialogInternal.prototype.initialize = function () {
			DialogInternal.super.prototype.initialize.call( this );

			// base layout
			this.content = new OO.ui.PanelLayout( { 
				padded: true,
				expanded: false 
			} );
			// info/title
			this.content.$element.append( /*html*/`<div class="info">${me.info}</div>` );
			// input
			const input = new OO.ui.MultilineTextInputWidget( {
				autosize: true,
				value: value,
			} );
			this.content.$element.append(input.$element);
			// append
			this.$body.append( this.content.$element );

			// cache
			me.elInfo = this.content.$element[0].querySelector('.info');
			me.ooInput = input;
		};

		DialogInternal.prototype.getActionProcess = function ( action ) {
			var dialog = this;
			console.log('[PromptWindow]', action);
			if ( action == 'cancel') {
				me.actionCancel(dialog, action);
			}
			else if ( action ) {
				return new OO.ui.Process( me.actionSave(dialog, action) );
			}
			return DialogInternal.super.prototype.getActionProcess.call( this, action );
		};		
	
		var dialogInternal = new DialogInternal();
	
		// Setup OO.oo window manager.
		var windowManager = new OO.ui.WindowManager();
		$( document.body ).append( windowManager.$element );
		windowManager.addWindows( [ dialogInternal ] );
	
		// Keep internals
		this.windowManager = windowManager;
		this.dialogInternal = dialogInternal;
	}
}
