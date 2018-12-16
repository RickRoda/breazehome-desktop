// START #2357 and #2487 Andreina Rojas aroja108@fiu.edu
'use strict';

angular.module('breazehomeDesktop').controller('BoardsCtrl', function ($scope, $localStorage, $routeParams, $document, Bilingual, Properties, Map, $rootScope, Lists, ModalService, toasts, $timeout, oauth, Users, Themes) {
	
	$('html, body').scrollTop(0);

	// Get Bilingual system
	$rootScope.storage = $localStorage;
	Bilingual.getLanguage('English');

	// For Top Nav
	$rootScope.currentPage = "AllBoards";

	// User personalization
	$scope.settings = {
		listView: 'card',
		selectedList: 0,
		properties: [],
        tag: {
            addedTag: false,
            newTag: '',
            editMode: false
        }
	}
	function addCardHoverListener(){
		const cards = Array.from(document.querySelectorAll('.card-wrapper'));
		console.log(cards)
		cards.forEach(card => {
			card.addEventListener('mouseover', e => {
				console.log(e);
				const save = card.getElementsByClassName('card-save')[0];
				save.style.top = '7px';
			})
		})
	}

	
	$scope.closeModal = function(){
		$('.modal-backdrop').hide();
	}
	
	
	var idObj = $routeParams;
	Properties.getPropertiesInBoard(idObj).then(function(res){
		$scope.boards = res.data;
		$scope.board = $routeParams;
	})
	
	
	// redirect to property detail
    $scope.clickProperty = function(board) {
    	window.location.href = "/#/results/"+board.id;
    }
	
	 $scope.deletePropBoard = function(e, id){
			e.preventDefault();

			
			Properties.deletePropBoard(id, idObj).then(res => {			
			})
			window.location.reload();
			
		}
	
	 $scope.selectPropertyToBoard = function(e,board, name){
			e.preventDefault();

		
			ModalService.showModal({
			   templateUrl: "views/modals/propstoboard.html",
			   controller: "PropsToBoardCtrl",
			   inputs: {
				   boardname: name,
			   }
			}).then(function(modal) {
			   modal.element.modal();
			   modal.close.then(function(result) {});
			});
			
		}
	
});
// END #2357 and #2487 Andreina Rojas aroja108@fiu.edu