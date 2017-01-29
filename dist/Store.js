"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var mobx_1 = require("mobx");
var mobx_collection_store_1 = require("mobx-collection-store");
var Record_1 = require("./Record");
var utils_1 = require("./utils");
var Store = (function (_super) {
    __extends(Store, _super);
    function Store() {
        return _super.apply(this, arguments) || this;
    }
    /**
     * Import the JSON API data into the store
     *
     * @param {IJsonApiResponse} body - JSON API response
     * @returns {(IModel|Array<IModel>)} - Models parsed from body.data
     *
     * @memberOf Store
     */
    Store.prototype.sync = function (body) {
        var data = this.__iterateEntries(body, this.__addRecord.bind(this));
        this.__iterateEntries(body, this.__updateRelationships.bind(this));
        return data;
    };
    /**
     * Add a new JSON API record to the store
     *
     * @private
     * @param {IJsonApiRecord} obj - Object to be added
     * @returns {IModel}
     *
     * @memberOf Store
     */
    Store.prototype.__addRecord = function (obj) {
        var type = obj.type, id = obj.id;
        var record = this.find(type, id);
        var flattened = utils_1.flattenRecord(obj);
        var availableModels = this.static.types.map(function (item) { return item.type; });
        if (record) {
            record.update(flattened);
        }
        else if (availableModels.indexOf(obj.type) !== -1) {
            record = this.add(flattened, obj.type);
        }
        else {
            record = new Record_1.Record(flattened);
            this.add(record);
        }
        return record;
    };
    /**
     * Update the relationships between models
     *
     * @private
     * @param {IJsonApiRecord} obj - Object to be updated
     * @returns {void}
     *
     * @memberOf Store
     */
    Store.prototype.__updateRelationships = function (obj) {
        var _this = this;
        var record = this.find(obj.type, obj.id);
        if (!record) {
            return;
        }
        var refs = obj.relationships ? Object.keys(obj.relationships) : [];
        refs.forEach(function (ref) {
            var items = obj.relationships[ref].data;
            if (items) {
                var models = utils_1.mapItems(items, function (_a) {
                    var id = _a.id, type = _a.type;
                    return _this.find(type, id);
                });
                record.assignRef(ref, models, obj.type);
            }
        });
    };
    /**
     * Iterate trough JSNO API response models
     *
     * @private
     * @param {IJsonApiResponse} body - JSON API response
     * @param {Function} fn - Function to call for every instance
     * @returns
     *
     * @memberOf Store
     */
    Store.prototype.__iterateEntries = function (body, fn) {
        utils_1.mapItems(body.included || [], fn);
        return utils_1.mapItems(body.data, fn);
    };
    return Store;
}(mobx_collection_store_1.Collection));
exports.Store = Store;
/**
 * List of Models that will be used in the collection
 *
 * @static
 *
 * @memberOf Store
 */
Store.types = [Record_1.Record];
__decorate([
    mobx_1.action
], Store.prototype, "sync", null);
