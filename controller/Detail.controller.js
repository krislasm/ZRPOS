/*global location */
var that = null;
sap.ui.define([
	"swa/rpos/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"swa/rpos/model/formatter",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(B, J, f, MessageToast, F, a) {
	"use strict";

	return B.extend("swa.rpos.controller.Detail", {

		formatter: f,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			that = this;
			var oViewModel = new J({
				busy: false,
				delay: 0,
				lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading")
			});
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "detailView");
		},
		_onObjectMatched: function(e) {

			/*	if (e.getParameter("arguments") && e.getParameter("arguments").navBack !== "StudentOverview") {*/
			this.swaId = e.getParameter("arguments").objectId;
			this.bP = e.getParameter("arguments").prgmId;
			this.sUrl = "/sap/opu/odata/sap/ZPIQ_STUDENT_PERSONAL_DETAILS_SRV/";
			/*if (this.byId("endDate")) {
				this.byId("endDate").setValue('');
			}
			if (this.byId("firstDate")) {
				this.byId("firstDate").setValue('');
			}*/
			this.byId("endDate").setValue('');
			this.byId("firstDate").setValue('');
			if (this.byId("AttTable").getModel("TransDetails")) {
				this.byId("AttTable").getInfoToolbar().setVisible(false);
				this.byId("AttTable").getModel("TransDetails").setData('');
				this.byId("AttTable").getModel("TransDetails").refresh();
			}
			/*	var oDataModel = new sap.ui.model.odata.v2.ODataModel(that.sUrl, {
					json: true,
					loadMetadataAsync: true
				});*/

			//oDataModel.read("/HeaderDetailsSet(StudentObjid='" + this.stdObjId + "')", p);
		},
		formatDate: function(date) {
			var d = new Date(date),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();

			if (month.length < 2) {
				month = '0' + month;
			}
			if (day.length < 2) {
				day = '0' + day;
			}
			//return [day, month, year].join('.');
			return [year, month, day].join('');
		},
		getTransDetails: function(e) {
			if (this.byId("firstDate").getValue() !== "" && this.byId("endDate").getValue() !== "") {
				var year = [],
					term = [],
					studentId = [];
				that = this;
				year.push(new sap.ui.model.Filter("swaId", sap.ui.model.FilterOperator.EQ, this.swaId));
				term.push(new sap.ui.model.Filter("fromDate", sap.ui.model.FilterOperator.EQ, this.formatDate(this.byId("firstDate").getDateValue())));
				studentId.push(new sap.ui.model.Filter("toDate", sap.ui.model.FilterOperator.EQ, this.formatDate(this.byId("endDate").getDateValue())));

				this.filterswaid = new sap.ui.model.Filter({
					filters: year,
					and: true
				});
				this.filtefromDate = new sap.ui.model.Filter({
					filters: term,
					and: true
				});
				this.toDate = new sap.ui.model.Filter({
					filters: studentId,
					and: true
				});
				var filter = new sap.ui.model.Filter({
					filters: [this.filterswaid, this.filtefromDate, this.toDate],
					and: true
				});
				this.oDataModel = this.getView().getModel();
				that.oDataModel.read("/TransDetailSet", {
					filters: [filter],
					success: function(oData, response) {

						var dataModel = new J();
						var info = "";
						dataModel.setData({
							"Value": oData.results
						});
						if(oData.results.length > 0)
						{
						if(oData.results[0].openBal !== "")
						{
							info = "Opening Balance: " + oData.results[0].openBal +" IDR"; 
						}
							if(oData.results[0].closeBal !== "")
						{
							info = info + " and Closing Balance: " + oData.results[0].closeBal +" IDR"; 
						}
						}
						that.getView().setModel(dataModel, "TransDetails");
						that.byId("AttTable").getModel("TransDetails").refresh();
						that.byId("AttTable").getInfoToolbar().setVisible(true);
						that.byId("openclosebal").setText(info);
						//	that.dropdownAssignmentData();
					}
				});
			} else {
				var dialog_1 = new sap.m.Dialog({
					title: 'Error',
					type: 'Message',
					state: 'Error',
					content: new sap.m.Text({
						text: 'Please ensure Date Range is selected.'
					}),
					beginButton: new sap.m.Button({
						text: 'OK',
						press: function() {
							dialog_1.close();
						}
					}),
					afterClose: function() {
						dialog_1.destroy();
					}
				});
				dialog_1.open();

			}
		}

	});

});