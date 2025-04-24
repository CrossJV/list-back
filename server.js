"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
console.log('express:', express_1.default);
var app = (0, express_1.default)();
var port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
var items = Array.from({ length: 1000000 }, function (_, i) { return ({
    id: i + 1,
    value: "Item ".concat(i + 1)
}); });
var sortedItems = __spreadArray([], items, true);
var selectedItems = [];
app.get('/items', function (req, res) {
    var offsetStr = req.query.offset;
    var limitStr = req.query.limit;
    var offset = parseInt(offsetStr !== null && offsetStr !== void 0 ? offsetStr : '0', 10);
    var end = offset + parseInt(limitStr !== null && limitStr !== void 0 ? limitStr : '20', 10);
    res.json(sortedItems.slice(offset, end));
});
app.post('/move', function (req, res) {
    console.log(req);
    var _a = req.body, from = _a.from, to = _a.to;
    var removed = sortedItems.splice(from, 1)[0];
    sortedItems.splice(to, 0, removed);
    res.json({ success: true });
});
app.post('/select', function (req, res) {
    var id = req.body.id;
    if (!selectedItems.includes(id)) {
        selectedItems.push(id);
    }
    res.json({ success: true });
});
app.post('/deselect', function (req, res) {
    var id = req.body.id;
    selectedItems = selectedItems.filter(function (s) { return s !== id; });
    res.json({ success: true });
});
app.get('/selected', function (req, res) {
    res.json(selectedItems);
});
app.get('/search', function (req, res) {
    var q = req.query.q;
    var offsetStr = req.query.offset;
    var limitStr = req.query.limit;
    var searchTerm = q !== null && q !== void 0 ? q : '';
    var offset = parseInt(offsetStr !== null && offsetStr !== void 0 ? offsetStr : '0', 10);
    var limit = parseInt(limitStr !== null && limitStr !== void 0 ? limitStr : '20', 10);
    var filtered = sortedItems.filter(function (item) { return item.value.toLowerCase().includes(searchTerm.toLowerCase()); });
    var start = offset;
    var end = start + limit;
    res.json(filtered.slice(start, end));
});
app.listen(port, function () {
    console.log("Server running at http://localhost:".concat(port));
});
