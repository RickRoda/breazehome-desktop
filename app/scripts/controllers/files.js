'use strict';

/**
 * @ngdoc controller
 * @name breazehomeDesktop.controller:FilesCtrl
 * @description
 * # FilesCtrl
 * Controller for file cards. Allows the user to modify, view, and reorganize their property cards.
 */

angular.module('breazehomeDesktop')
.controller('FilesCtrl', function ($scope, Cards) {

	// Contains statuses and their lsit of cards.
	$scope.statuses = [
		{
			id: 0,
			title: 'Status 1',
			list: []
		},
		{
			id: 1,
			title: 'Status 2',
			list: []
		},
		{
			id: 2,
			title: 'Status 3',
			list: []
		},
		{
			id: 3,
			title: 'Status 4',
			list: []
		},
		{
			id: 4,
			title: 'Status 5',
			list: []
		},
		{
			id: 5,
			title: 'Status 6',
			list: []
		},
		{
			id: 6,
			title: 'Status 7',
			list: []
		},
	];


	// Required params for getting all User cards.
	let getCardParams = {
		offset: 0, 
		RequestTypeIDs: "2,3,1,5,4,6", 
		FloorsFrom: 0, 
		PriceMin: 1000000000, 
		PriceMax: 405000000000, 
		BedRoomFrom: 1, 
		AreaMeterFrom: 32, 
		AreaMeterTo: 900, 
		Parking: false, 
		Anbari: false,
		UserID: 758,
		Status: 1,
		userName: 't.test'
	};

	// Get all User cards, then filter them into their respective status list.
	Cards.getCards(getCardParams).then( res => {
		res.data.forEach( list => {
			list.forEach( card => {
				$scope.statuses[card.TblRESEstateCard.Status].list.push(card);	
			})
		})
	})	
});