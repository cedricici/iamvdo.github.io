/*!
 * Greeed.js 0.3
 * MIT licensed
 *
 * Copyright (C) 2013 Vincent De Oliveira, http://iamvdo.me
 */
 (function(){

 	"use strict";

 	var greeed;

 	function goGreeed (grid, method, options) {

 		var target = document.querySelector(grid);
 		if (target !== null) {
			method.call(null, target, options);
		}
 	}
 	function add (grid, options) {

 		greeed = new Greeed(grid, options);
 		greeed.init();

 	}
 	function remove (grid) {
 		
 		greeed.destroy();

 	}

	function Greeed (elem, options) {

		this.grid = elem;
		this.nbColumns = 0;
		this.childs = this.columns = this.options = [];

		this.rootFontSize = getComputedStyle(document.documentElement).getPropertyValue('font-size').replace('px','');

		for(var key in options){
			if(options.hasOwnProperty(key)){
				this.defaults[key] = options[key];
			}
		}
		this.options = this.defaults;

	}

	Greeed.prototype = {

		defaults: {
			fakeItem: false,
			fakeItemClass: 'Greeed-item--fake'
		},

		init: function () {

			// Get elements
			this.childs = Array.prototype.slice.call(this.grid.children);
			// DOM columns
			this.columnsDOM = [];

			this.checkMQ();

			var scope = this;
			this.startCheckMQ = function(event) { scope.checkMQ(event); };

			window.addEventListener('resize', this.startCheckMQ, false);
			
			if ( this.options.afterInit ) {
				this.options.afterInit();
			}

		},

		destroy: function () {
			window.removeEventListener('resize', this.startCheckMQ, false);
		},

		createColumns: function ( greeedWidth ) {

			// create an Array of columns
			this.columns = new Array(this.nbColumns);
			for (var i = 0; i < this.nbColumns; i++) {
				this.columns[i] = new Array();
				// set height
				this.columns[i]._offsetHeight = 0;
			};

			for (var i = 0; i < this.childs.length; i++) {

				var smallestColumnHeight = 0;
				var smallestColumnIndex = 0;
				// find the smallest column to place the next child
				for (var j = 0; j < this.columns.length; j++) {
					var columnHeight = this.columns[j]._offsetHeight;
					if(j == 0){
						smallestColumnHeight = columnHeight;
					}
					if(columnHeight == 0){
						smallestColumnIndex = j;
						break;
					}
					if(columnHeight < smallestColumnHeight){
						smallestColumnIndex = j;
					}
				}

				// add child to the smallest height column
				this.columns[smallestColumnIndex].push(this.childs[i]);

				// add an id (keep the old position)
				this.childs[i]._id = i;

				// update column height
				this.columns[smallestColumnIndex]._offsetHeight += this.childs[i].offsetHeight;

			}

			// find the max-height column
			var maxHeightColumn = 0;
			for (var i = 0; i < this.columns.length; i++) {

				var height = this.columns[i]._offsetHeight;

				if( height >= maxHeightColumn){
					maxHeightColumn = height;
				}
			
			};

			var grid = document.createDocumentFragment();

			for (var i = 0; i < this.columns.length; i++) {
				
				var column = document.createElement('li');
					column.className = 'Greeed-column';
					column.style.styleFloat = column.style.cssFloat = 'left';
					column.style.width = Math.floor( greeedWidth / this.nbColumns ) + 'px';
				var columnElement = document.createElement('ul');
					//column.style.width = 100 / this.nbColumns + '%';


				for (var j = 0; j < this.columns[i].length; j++) {
					columnElement.appendChild(this.columns[i][j]);
				}

				if( this.columns[i]._offsetHeight < maxHeightColumn && this.options.fakeItem){
					
					var fake_elem = document.createElement('li');
						fake_elem.className = this.options.fakeItemClass;
						fake_elem.style.height = maxHeightColumn - this.columns[i]._offsetHeight + 'px';
							
						columnElement.appendChild(fake_elem);
				}

				column.appendChild(columnElement);

				// add the column to the DOM columns array
				this.columnsDOM[i] = column;

				grid.appendChild(column);

			};


			this.grid.innerHTML = '';
			this.grid.appendChild(grid);

			if( this.options.afterLayout ){
				this.options.afterLayout();
			}
		
		},

		setColumnsWidth: function ( greeedWidth ) {

			// update width to match parent width
			var newColumnWidth = Math.floor( greeedWidth / this.nbColumns );
			var greeedWidthCalc = newColumnWidth * this.nbColumns;
			var pixelsLeft = greeedWidth - greeedWidthCalc;

			for (var i = 0; i < this.columnsDOM.length; i++) {
				var colWidth = (pixelsLeft > 0) ? newColumnWidth + 1 : newColumnWidth;
				pixelsLeft--;
				this.columnsDOM[i].style.width = colWidth + 'px';
			}

			

		},

		checkMQ: function (event) {
			//var scope = this;
			var lastNbColumns = this.nbColumns;
			
			this.windowWidth = window.innerWidth;
			
			// for each breakpoints
			for (var i = 0; i < this.options.breakpoints.length; i++) {
				var point = this.options.breakpoints[i],
					size = point * this.rootFontSize;

				// set how many columns to create 
				if( window.innerWidth < size ) {
					this.nbColumns = i + 1;
					break;
				} else {
					this.nbColumns = i + 2;
				}
				
			};

			// Get the width of the greeed, every time
			var greeedWidth = Math.floor(getComputedStyle(this.grid).getPropertyValue('width').replace('px',''));

			// create columns, only if nbColumns is different
			//if ( lastNbColumns !== this.nbColumns ) {
				this.createColumns( greeedWidth );
			//}

			// set columns width, every time
			this.setColumnsWidth( greeedWidth );
			
		}
	}
	
	window.greeed = {
		bind: function (elem, options) {
			goGreeed(elem, add, options);
		},
		unbind: function (elem) {
			goGreeed(elem, remove);
		}
	}

})();